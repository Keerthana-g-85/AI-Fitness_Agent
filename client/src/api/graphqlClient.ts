import { GraphQLClient } from "graphql-request";

const GRAPHQL_ENDPOINT = "http://localhost:3001/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT);
