import { GraphQLClient } from "graphql-request";
import { getAuthToken } from "./auth";

const GRAPHQL_ENDPOINT = "http://localhost:3001/graphql";

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: "include",
  requestMiddleware: (request) => {
    const token = getAuthToken();

    if (!token) {
      return request;
    }

    const headers = new Headers(request.headers);
    headers.set("Authorization", `Bearer ${token}`);

    return { ...request, headers };
  },
});
