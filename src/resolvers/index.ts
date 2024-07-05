import prisma from "../database";
import Query from "./query";
import Mutation from "./mutation";

// const Product = {
//   id: (parent, args, context, info) => parent.id,
//   name: (parent) => parent.name,
//   description: (parent) => parent.description,
//   varients: (parent) => parent.varients,
//   details: (parent, args) => {
//     return prisma.details.findFirst({
//       where: {
//         options: {
//           every: {
//             // Args is an array of option ids
//             id: {
//               in: args.varientCombination,
//             },
//           },
//         },
//       },
//     });
//   },
// };

const Resolvers = {
  Query,
  Mutation,
  // Product,
};

export default Resolvers;
