import { gql } from "graphql-request";

export const USER_LOGIN = gql`
  mutation LoginUser($input: LoginArguments!) {
    loginUser(input: $input) {
      success
      message
      token
      user {
        id
        name
        email
        onboardingCompleted
        onboardingCompletedAt
      }
    }
  }
`;
