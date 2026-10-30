import { ClientError } from "graphql-request";
import { graphqlClient } from "./graphqlClient";
import { USER_REGISTER } from "../graphql/Mutation/USER_REGISTER";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

interface RegisterMutationData {
  createUser: RegisterResponse;
}

export const registerUser = async (
  input: CreateUserInput,
): Promise<RegisterResponse> => {
  const data = await graphqlClient.request<
    RegisterMutationData,
    { input: CreateUserInput }
  >(USER_REGISTER, { input });

  return data.createUser;
};

export const getRegistrationErrorMessage = (error: unknown): string => {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
