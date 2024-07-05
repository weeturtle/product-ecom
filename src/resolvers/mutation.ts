import prisma from "../database";

interface Option {
  name: string;
}

interface Varient {
  name: string;
  options: Option[];
}

const Mutation = {
  createProduct: async (_: any, args: any) => {
    const { name, description, varients } = args;
    return prisma.product.create({
      data: {
        name,
        description,
        varients: {
          create: varients.map((varient: Varient) => ({
            name: varient.name,
            options: {
              create: varient.options.map((option) => ({
                name: option.name,
              })),
            },
          })),
        },
      },
    });
  },
};

export default Mutation;
