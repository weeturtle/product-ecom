import { ApolloServer } from "@apollo/server";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema/products-schema";
import resolvers from "./resolvers";

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers,
  }),
});

const main = async () => {
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: 4001,
    },
  });

  console.log(`🚀 Apollo ready at ${url}`);
};

main();
