import prisma from "../database";

interface IOptionDetail {
  varient_id: string;
  value: string;
}

const Query = {
  products: async () => {
    return prisma.product.findMany({
      include: {
        varients: {
          include: {
            skuOptions: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    });
  },
  product: async (_: any, args: any) => {
    const { id } = args;

    // As options are within the SKU_Option table, we need to fetch the product and its varients
    // and then include the varients' options
    const products = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        varients: {
          include: {
            skuOptions: {
              select: {
                value: true,
              },
            },
          },
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return products;
  },
  productByOptions: async (_: any, args: any) => {
    const { productID, options } = args;

    const skuPossibilities = await Promise.all(
      options.map((optionDetail: IOptionDetail) => {
        return prisma.sKU_Option.findMany({
          where: {
            value: optionDetail.value,
            varientId: optionDetail.varient_id,
          },
          select: {
            skuId: true,
          },
        });
      }),
    );

    const ids = skuPossibilities.map((skus: { [skuId: string]: string }[]) =>
      skus.map((sku) => sku.skuId),
    );

    // Find the common SKU IDs
    const sku_id = ids.reduce((acc, curr) => {
      return acc.filter((value) => curr.includes(value));
    });

    if (!sku_id.length) {
      return null;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productID,
      },
      include: {
        skus: {
          where: {
            id: {
              equals: sku_id[0],
            },
          },
          select: {
            stock: true,
            price: true,
            images: true,
          },
        },
        varients: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      id: product?.id,
      name: product?.name,
      description: product?.description,
      varients: product?.varients,
      options: options.map((option: IOptionDetail) => option.value),
      price: product?.skus[0].price,
      stock: product?.skus[0].stock,
      images: product?.skus[0].images,
    };
  },

  productOptions: async (_: any, args: any) => {
    const { productID } = args;

    const product = await prisma.product.findUnique({
      where: {
        id: productID,
      },
      include: {
        varients: {
          include: {
            skuOptions: {
              select: {
                value: true,
              },
            },
          },
        },
      },
    });

    // Only return a list of the varients with their name, id and options

    // console.table(product?.varients[0].skuOptions);

    const details = product?.varients.map((varient) => {
      return {
        varient_id: varient.id,
        varient_name: varient.name,
        options: varient.skuOptions.map((skuOption) => skuOption.value),
      };
    });

    console.table(details);
    return details;
  },
};

export default Query;
