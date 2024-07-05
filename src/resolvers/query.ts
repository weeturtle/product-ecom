import prisma from "../database";

const Query = {
  products: async () => {
    return prisma.product.findMany({
      include: {
        varients: {
          include: {
            options: true,
          },
        },
      },
    });
  },
  product: async (_: any, args: any) => {
    const { id } = args;
    return prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        varients: {
          include: {
            options: true,
          },
        },
      },
    });
  },
};

export default Query;
