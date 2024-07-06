import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema/products-schema";
import resolvers from "./resolvers";
import prisma from "./database";

const PORT = process.env.PORT || 4000;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(PORT).then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
