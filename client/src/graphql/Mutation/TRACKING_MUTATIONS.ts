import { gql } from "graphql-request";

const RESULT = gql`
  fragment TrackingMutationResult on TrackingMutationResponse {
    success
    message
    id
  }
`;

export const ADD_FOOD_INTAKE = gql`
  ${RESULT}
  mutation AddFoodIntake($input: FoodIntakeInput!) {
    addFoodIntake(input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const UPDATE_FOOD_INTAKE = gql`
  ${RESULT}
  mutation UpdateFoodIntake($id: ID!, $input: UpdateFoodIntakeInput!) {
    updateFoodIntake(id: $id, input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const DELETE_FOOD_INTAKE = gql`
  ${RESULT}
  mutation DeleteFoodIntake($id: ID!) {
    deleteFoodIntake(id: $id) {
      ...TrackingMutationResult
    }
  }
`;

export const ADD_WATER_INTAKE = gql`
  ${RESULT}
  mutation AddWaterIntake($input: WaterIntakeInput!) {
    addWaterIntake(input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const UPDATE_WATER_INTAKE = gql`
  ${RESULT}
  mutation UpdateWaterIntake($id: ID!, $input: UpdateWaterIntakeInput!) {
    updateWaterIntake(id: $id, input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const DELETE_WATER_INTAKE = gql`
  ${RESULT}
  mutation DeleteWaterIntake($id: ID!) {
    deleteWaterIntake(id: $id) {
      ...TrackingMutationResult
    }
  }
`;

export const ADD_WORKOUT = gql`
  ${RESULT}
  mutation AddWorkout($input: WorkoutSessionInput!) {
    addWorkout(input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const UPDATE_WORKOUT = gql`
  ${RESULT}
  mutation UpdateWorkout($id: ID!, $input: UpdateWorkoutSessionInput!) {
    updateWorkout(id: $id, input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const DELETE_WORKOUT = gql`
  ${RESULT}
  mutation DeleteWorkout($id: ID!) {
    deleteWorkout(id: $id) {
      ...TrackingMutationResult
    }
  }
`;

export const SAVE_SLEEP_RECORD = gql`
  ${RESULT}
  mutation SaveSleepRecord($input: SleepRecordInput!) {
    saveSleepRecord(input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const UPDATE_SLEEP_RECORD = gql`
  ${RESULT}
  mutation UpdateSleepRecord($id: ID!, $input: UpdateSleepRecordInput!) {
    updateSleepRecord(id: $id, input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const DELETE_SLEEP_RECORD = gql`
  ${RESULT}
  mutation DeleteSleepRecord($id: ID!) {
    deleteSleepRecord(id: $id) {
      ...TrackingMutationResult
    }
  }
`;

export const ADD_SPORTS_ACTIVITY = gql`
  ${RESULT}
  mutation AddSportsActivity($input: SportsActivityInput!) {
    addSportsActivity(input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const UPDATE_SPORTS_ACTIVITY = gql`
  ${RESULT}
  mutation UpdateSportsActivity($id: ID!, $input: UpdateSportsActivityInput!) {
    updateSportsActivity(id: $id, input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const DELETE_SPORTS_ACTIVITY = gql`
  ${RESULT}
  mutation DeleteSportsActivity($id: ID!) {
    deleteSportsActivity(id: $id) {
      ...TrackingMutationResult
    }
  }
`;

export const ADD_BODY_MEASUREMENT = gql`
  ${RESULT}
  mutation AddBodyMeasurement($input: AddBodyMeasurementInput!) {
    addBodyMeasurement(input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const UPDATE_BODY_MEASUREMENT = gql`
  ${RESULT}
  mutation UpdateBodyMeasurement(
    $id: ID!
    $input: UpdateBodyMeasurementRecordInput!
  ) {
    updateBodyMeasurement(id: $id, input: $input) {
      ...TrackingMutationResult
    }
  }
`;

export const DELETE_BODY_MEASUREMENT = gql`
  ${RESULT}
  mutation DeleteBodyMeasurement($id: ID!) {
    deleteBodyMeasurement(id: $id) {
      ...TrackingMutationResult
    }
  }
`;
