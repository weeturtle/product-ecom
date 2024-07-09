import prisma from "../database";

interface IOptionDetail {
  varient_name: string;
  value: string;
}

interface IOptions {
  options: [IOptionDetail];
  isDefault: boolean;
  price: number;
  stock: number;
  images: [string];
}

interface ICreateProductArgs {
  name: string;
  description: string;
  varients: [string];
  options: [IOptions];
}

const Mutation = {
  createProduct: async (_: any, args: any) => {
    const { name, description, varients, options } = args as ICreateProductArgs;

    if (!varients.length) {
      // First create a product with no SKU,
      // then add SKU to it
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
        },
      });

      await prisma.sKU.create({
        data: {
          price: options[0].price,
          stock: options[0].stock,
          images: options[0].images,
          product: {
            connect: {
              id: newProduct.id,
            },
          },
          defaultSku: {
            connect: {
              id: newProduct.id,
            },
          },
        },
      });

      // Return the product with the SKU
      return prisma.product.findUnique({
        where: {
          id: newProduct.id,
        },
        include: {
          varients: true,
        },
      });
    }

    // If at least one varient is present
    const product = await prisma.product.create({
      data: {
        name,
        description,
        varients: {
          create: varients.map((varient) => ({
            name: varient,
          })),
        },
      },
      include: {
        varients: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    for (const option of options) {
      await prisma.sKU.create({
        data: {
          price: option.price,
          stock: option.stock,
          images: option.images,
          product: {
            connect: {
              id: product.id,
            },
          },
          // Only connect the default SKU to the product
          // if the option is the default
          defaultSku: option.isDefault
            ? {
                connect: {
                  id: product.id,
                },
              }
            : undefined,
          options: {
            create: option.options.map((optionDetail) => ({
              value: optionDetail.value,
              Varient: {
                connect: {
                  id: product.varients.find(
                    (varient) => varient.name === optionDetail.varient_name,
                  )?.id,
                },
              },
            })),
          },
        },
      });
    }

    return product;
  },
};
export default Mutation;
