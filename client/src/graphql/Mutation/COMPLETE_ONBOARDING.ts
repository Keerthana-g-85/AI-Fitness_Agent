import { gql } from "graphql-request";

export const COMPLETE_ONBOARDING = gql`
  mutation CompleteOnboarding($input: CompleteOnboardingInput!) {
    completeOnboarding(input: $input) {
      success
      message
    }
  }
`;
