import { gql } from "graphql-request";

export const GET_DASHBOARD = gql`
  query GetDashboard {
    getDashboard {
      user {
        id
        name
        email
        onboardingCompleted
        onboardingCompletedAt
      }
      profile {
        dateOfBirth
        heightCm
        gender
        occupation
        country
        activityLevel
      }
      fitnessGoal {
        id
        primaryGoal
        secondaryGoal
        currentWeightKg
        targetWeightKg
        targetBodyFatPercentage
        targetMuscleMassKg
        targetDate
      }
      latestBodyMeasurement {
        id
        weightKg
        heightCm
        source
        measuredAt
        createdAt
      }
      latestBodyComposition {
        id
        bodyFatPercentage
        bmi
        measuredAt
      }
    }
  }
`;
