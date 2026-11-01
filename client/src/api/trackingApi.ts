import { ClientError } from "graphql-request";
import { graphqlClient } from "./graphqlClient";
import { GET_DAILY_TRACKING } from "../graphql/Query/GET_DAILY_TRACKING";
import { GET_BODY_MEASUREMENT_HISTORY } from "../graphql/Query/GET_BODY_MEASUREMENT_HISTORY";
import {
  ADD_BODY_MEASUREMENT,
  ADD_FOOD_INTAKE,
  ADD_SPORTS_ACTIVITY,
  ADD_WATER_INTAKE,
  ADD_WORKOUT,
  DELETE_BODY_MEASUREMENT,
  DELETE_FOOD_INTAKE,
  DELETE_SLEEP_RECORD,
  DELETE_SPORTS_ACTIVITY,
  DELETE_WATER_INTAKE,
  DELETE_WORKOUT,
  SAVE_SLEEP_RECORD,
  UPDATE_BODY_MEASUREMENT,
  UPDATE_FOOD_INTAKE,
  UPDATE_SLEEP_RECORD,
  UPDATE_SPORTS_ACTIVITY,
  UPDATE_WATER_INTAKE,
  UPDATE_WORKOUT,
} from "../graphql/Mutation/TRACKING_MUTATIONS";
import type {
  AddBodyMeasurementInput,
  DailyTracking,
  FoodIntakeInput,
  MeasurementRecord,
  SleepRecordInput,
  SportsActivityInput,
  TrackingMutationResult,
  UpdateBodyMeasurementInput,
  UpdateFoodIntakeInput,
  UpdateSleepRecordInput,
  UpdateSportsActivityInput,
  UpdateWaterIntakeInput,
  UpdateWorkoutSessionInput,
  WaterIntakeInput,
  WorkoutSessionInput,
} from "../types/tracking";

export const trackingQueryKeys = {
  daily: (date: string) => ["daily-tracking", date] as const,
  measurements: ["body-measurement-history"] as const,
};

interface DailyTrackingData {
  getDailyTracking: DailyTracking;
}

interface MeasurementHistoryData {
  getBodyMeasurementHistory: MeasurementRecord[];
}

const requestMutation = async (
  document: string,
  variables: Record<string, unknown>,
  key: string,
): Promise<TrackingMutationResult> => {
  const data = await graphqlClient.request<Record<string, TrackingMutationResult>>(
    document,
    variables,
  );

  return data[key] as TrackingMutationResult;
};

export const getDailyTracking = async (date: string): Promise<DailyTracking> => {
  const data = await graphqlClient.request<DailyTrackingData, { date: string }>(
    GET_DAILY_TRACKING,
    { date },
  );

  return data.getDailyTracking;
};

export const getBodyMeasurementHistory = async (
  limit = 100,
): Promise<MeasurementRecord[]> => {
  const data = await graphqlClient.request<
    MeasurementHistoryData,
    { limit: number }
  >(GET_BODY_MEASUREMENT_HISTORY, { limit });

  return data.getBodyMeasurementHistory;
};

export const addFoodIntake = (input: FoodIntakeInput) =>
  requestMutation(ADD_FOOD_INTAKE, { input }, "addFoodIntake");

export const updateFoodIntake = (id: string, input: UpdateFoodIntakeInput) =>
  requestMutation(UPDATE_FOOD_INTAKE, { id, input }, "updateFoodIntake");

export const deleteFoodIntake = (id: string) =>
  requestMutation(DELETE_FOOD_INTAKE, { id }, "deleteFoodIntake");

export const addWaterIntake = (input: WaterIntakeInput) =>
  requestMutation(ADD_WATER_INTAKE, { input }, "addWaterIntake");

export const updateWaterIntake = (id: string, input: UpdateWaterIntakeInput) =>
  requestMutation(UPDATE_WATER_INTAKE, { id, input }, "updateWaterIntake");

export const deleteWaterIntake = (id: string) =>
  requestMutation(DELETE_WATER_INTAKE, { id }, "deleteWaterIntake");

export const addWorkout = (input: WorkoutSessionInput) =>
  requestMutation(ADD_WORKOUT, { input }, "addWorkout");

export const updateWorkout = (id: string, input: UpdateWorkoutSessionInput) =>
  requestMutation(UPDATE_WORKOUT, { id, input }, "updateWorkout");

export const deleteWorkout = (id: string) =>
  requestMutation(DELETE_WORKOUT, { id }, "deleteWorkout");

export const saveSleepRecord = (input: SleepRecordInput) =>
  requestMutation(SAVE_SLEEP_RECORD, { input }, "saveSleepRecord");

export const updateSleepRecord = (id: string, input: UpdateSleepRecordInput) =>
  requestMutation(UPDATE_SLEEP_RECORD, { id, input }, "updateSleepRecord");

export const deleteSleepRecord = (id: string) =>
  requestMutation(DELETE_SLEEP_RECORD, { id }, "deleteSleepRecord");

export const addSportsActivity = (input: SportsActivityInput) =>
  requestMutation(ADD_SPORTS_ACTIVITY, { input }, "addSportsActivity");

export const updateSportsActivity = (
  id: string,
  input: UpdateSportsActivityInput,
) => requestMutation(UPDATE_SPORTS_ACTIVITY, { id, input }, "updateSportsActivity");

export const deleteSportsActivity = (id: string) =>
  requestMutation(DELETE_SPORTS_ACTIVITY, { id }, "deleteSportsActivity");

export const addBodyMeasurement = (input: AddBodyMeasurementInput) =>
  requestMutation(ADD_BODY_MEASUREMENT, { input }, "addBodyMeasurement");

export const updateBodyMeasurement = (
  id: string,
  input: UpdateBodyMeasurementInput,
) => requestMutation(UPDATE_BODY_MEASUREMENT, { id, input }, "updateBodyMeasurement");

export const deleteBodyMeasurement = (id: string) =>
  requestMutation(DELETE_BODY_MEASUREMENT, { id }, "deleteBodyMeasurement");

export const getTrackingErrorMessage = (error: unknown): string => {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? "Unable to load tracking data";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
