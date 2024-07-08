import prisma from "../database";

interface IOptionDetail {
  varient_name: string;
  value: string;
}

interface IOptions {
  options: [IOptionDetail];
  price: number;
  stock: number;
  images: [string];
}

interface IArgs {
  name: string;
  description: string;
  varients: [string];
  options: [IOptions];
}

const Mutation = {
  createProduct: async (_: any, args: any) => {
    const { name, description, varients, options } = args as IArgs;

    if (!varients.length) {
      return prisma.product.create({
        data: {
          name,
          description,
          skus: {
            create: {
              price: options[0].price,
              stock: options[0].stock,
              images: options[0].images,
              options: {},
            },
          },
        },
      });
    }

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
