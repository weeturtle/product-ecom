import prisma from "../database";

interface IOptionDetail {
  varient_id: string;
  value: string;
}

const Query = {
  products: async () => {
    const products = await prisma.product.findMany({
      include: {
        varients: true,
      },
    });

    return products;
  },
  product: async (_: any, args: any) => {
    const { id } = args;

    // As options are within the SKU_Option table, we need to fetch the product and its varients
    // and then include the varients' options
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        varients: {
          include: {
            skuOptions: true,
          },
        },
      },
    });

    if (!product) return null;

    // For each varient, remove the duplicates of the skuOptions
    // and return the varient with the options

    const varients = product.varients.map((varient) => {
      const options = varient.skuOptions.map((option) => option.value);
      const uniqueOptions = [...new Set(options)];
      return {
        varient: {
          id: varient.id,
          name: varient.name,
        },
        options: uniqueOptions,
      };
    });

    return {
      ...product,
      varients,
    };
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
  displayProducts: async () => {
    const products = await prisma.product.findMany({
      include: {
        varients: true,
      },
    });

    const detailedProducts = products.map(async (product) => {
      if (!product.defaultSkuId) return product;

      const skuDetails = await prisma.sKU.findUnique({
        where: {
          id: product.defaultSkuId,
        },
        select: {
          price: true,
          stock: true,
          images: true,
        },
      });

      if (!skuDetails) return product;

      return {
        ...product,
        ...skuDetails,
      };
    });

    return Promise.all(detailedProducts);
  },
};

export default Query;
