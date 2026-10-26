import express from "express";
import { ApolloServer } from "apollo-server-express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./graphql/resolvers/UserResolver";
import { dataSource } from "./data-source";

async function main() {
  await dataSource.initialize();

  const schema = await buildSchema({
    resolvers: [UserResolver],
  });

  const app = express();
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({ req }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
  });
}

main().catch((err) => {
  console.error("Error starting server:", err);
});