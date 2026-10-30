import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";
import { buildSchema } from "type-graphql";
import { connection } from "./database";
import UserResolver from "./Resolver/UserResolver";

dotenv.config();

const FRONTEND_ORIGIN = "http://localhost:5173";

const startServer = async (): Promise<void> => {
  await connection();

  const schema = await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });

  const apolloServer = new ApolloServer({ schema });
  await apolloServer.start();

  const app = express();

  app.use(
    cors({
      origin: FRONTEND_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json());
  app.use("/graphql", expressMiddleware(apolloServer));

  const port = Number(process.env.PORT) || 3001;

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}/graphql`);
  });
};

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
