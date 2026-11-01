import { ClientError } from "graphql-request";
import { graphqlClient } from "./graphqlClient";
import { USER_LOGIN } from "../graphql/Mutation/USER_LOGIN";
import { LOGOUT_USER } from "../graphql/Mutation/LOGOUT_USER";
import type { LoginInput, LoginResponse } from "../types/profile";

interface LoginMutationData {
  loginUser: LoginResponse;
}

interface LogoutMutationData {
  logoutUser: {
    success: boolean;
    message: string;
  };
}

export const loginUser = async (
  input: LoginInput,
): Promise<LoginResponse> => {
  const data = await graphqlClient.request<
    LoginMutationData,
    { input: LoginInput }
  >(USER_LOGIN, { input });

  return data.loginUser;
};

export const logoutUser = async (): Promise<void> => {
  await graphqlClient.request<LogoutMutationData>(LOGOUT_USER);
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? "Unable to sign in";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
