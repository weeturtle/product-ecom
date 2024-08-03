import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/subgraph";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";

import { typeDefs } from "./schema/products-schema";
import resolvers from "./resolvers";
import { verifyToken } from "./utils/auth";

interface HTTPHandler {
  token?: string;
}

const main = async () => {
  const app = express();

  const httpServer = http.createServer(app);

  const server = new ApolloServer<HTTPHandler>({
    schema: buildSubgraphSchema({
      typeDefs,
      resolvers,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    csrfPrevention: false,
  });

  await server.start();

  app.use("/", cors<cors.CorsRequest>(), express.json());

  app.post("/testverify", async (req, res) => {
    const token = req.body["token"] as string;
    if (!token) {
      res.status(400).send("Token not provided");
      return;
    }

    try {
      const info = await verifyToken(token);
      console.log(info);
      return res.send(info).status(200);
    } catch (err) {
      console.error(err);
      return res.status(401).send("Invalid token");
    }

    res.send("Test verify");
  });

  const mainServer = httpServer.listen({ port: 4001 });
  console.log(`🚀 Apollo ready at ${mainServer.address()}`);
  console.table(mainServer.address());
};

main();
