import { gql } from "graphql-request";

export const USER_REGISTER = gql`
  mutation CreateUser($input: CreateUserArguments!) {
    createUser(input: $input) {
      success
      message
      token
    }
  }
`;
