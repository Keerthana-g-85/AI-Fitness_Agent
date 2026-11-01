import { Arg, Ctx, ID, Int, Mutation, Query, Resolver } from "type-graphql";
import { GraphQLError } from "graphql";
import {
  FoodIntakeInput,
  SleepRecordInput,
  SportsActivityInput,
  UpdateFoodIntakeInput,
  UpdateSleepRecordInput,
  UpdateSportsActivityInput,
  UpdateWaterIntakeInput,
  UpdateWorkoutSessionInput,
  WaterIntakeInput,
  WorkoutSessionInput,
} from "../Arguments/TrackingArguments";
import {
  AddBodyMeasurementInput,
  UpdateBodyMeasurementRecordInput,
} from "../Arguments/MeasurementArguments";
import type {
  BodyMeasurementHistoryResponse,
  DailyTrackingResponse,
  TrackingMutationResponse,
} from "../Response/ProfileResponse";
import {
  BodyMeasurementHistoryResponse as BodyMeasurementHistoryResponseType,
  DailyTrackingResponse as DailyTrackingResponseType,
  TrackingMutationResponse as TrackingMutationResponseType,
} from "../Response/ProfileResponse";
import MeasurementService from "../Service/MeasurementService";
import TrackingService from "../Service/TrackingService";

interface TrackingContext {
  userId?: string | null;
}

const requireAuthentication = (userId?: string | null): string => {
  if (!userId) {
    throw new GraphQLError("Authentication required", {
      extensions: { code: "UNAUTHENTICATED" },
    });
  }

  return userId;
};

@Resolver()
export default class TrackingResolver {
  private readonly trackingService = new TrackingService();
  private readonly measurementService = new MeasurementService();

  @Query(() => DailyTrackingResponseType)
  async getDailyTracking(
    @Arg("date", () => String) date: string,
    @Ctx() context: TrackingContext,
  ): Promise<DailyTrackingResponse> {
    return this.trackingService.getDailyTracking(
      requireAuthentication(context.userId),
      date,
    );
  }

  @Query(() => [BodyMeasurementHistoryResponseType])
  async getBodyMeasurementHistory(
    @Arg("limit", () => Int, { nullable: true }) limit: number | undefined,
    @Ctx() context: TrackingContext,
  ): Promise<BodyMeasurementHistoryResponse[]> {
    return this.measurementService.getHistory(
      requireAuthentication(context.userId),
      limit ?? 100,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async addFoodIntake(
    @Arg("input", () => FoodIntakeInput) input: FoodIntakeInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.addFoodIntake(
      requireAuthentication(context.userId),
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async updateFoodIntake(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateFoodIntakeInput) input: UpdateFoodIntakeInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.updateFoodIntake(
      requireAuthentication(context.userId),
      id,
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async deleteFoodIntake(
    @Arg("id", () => ID) id: string,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.deleteFoodIntake(
      requireAuthentication(context.userId),
      id,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async addWaterIntake(
    @Arg("input", () => WaterIntakeInput) input: WaterIntakeInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.addWaterIntake(
      requireAuthentication(context.userId),
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async updateWaterIntake(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateWaterIntakeInput) input: UpdateWaterIntakeInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.updateWaterIntake(
      requireAuthentication(context.userId),
      id,
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async deleteWaterIntake(
    @Arg("id", () => ID) id: string,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.deleteWaterIntake(
      requireAuthentication(context.userId),
      id,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async addWorkout(
    @Arg("input", () => WorkoutSessionInput) input: WorkoutSessionInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.addWorkout(
      requireAuthentication(context.userId),
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async updateWorkout(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateWorkoutSessionInput)
    input: UpdateWorkoutSessionInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.updateWorkout(
      requireAuthentication(context.userId),
      id,
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async deleteWorkout(
    @Arg("id", () => ID) id: string,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.deleteWorkout(
      requireAuthentication(context.userId),
      id,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async saveSleepRecord(
    @Arg("input", () => SleepRecordInput) input: SleepRecordInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.saveSleep(
      requireAuthentication(context.userId),
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async updateSleepRecord(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateSleepRecordInput) input: UpdateSleepRecordInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.updateSleep(
      requireAuthentication(context.userId),
      id,
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async deleteSleepRecord(
    @Arg("id", () => ID) id: string,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.deleteSleep(
      requireAuthentication(context.userId),
      id,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async addSportsActivity(
    @Arg("input", () => SportsActivityInput) input: SportsActivityInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.addSportsActivity(
      requireAuthentication(context.userId),
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async updateSportsActivity(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateSportsActivityInput)
    input: UpdateSportsActivityInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.updateSportsActivity(
      requireAuthentication(context.userId),
      id,
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async deleteSportsActivity(
    @Arg("id", () => ID) id: string,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.trackingService.deleteSportsActivity(
      requireAuthentication(context.userId),
      id,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async addBodyMeasurement(
    @Arg("input", () => AddBodyMeasurementInput)
    input: AddBodyMeasurementInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.measurementService.addMeasurement(
      requireAuthentication(context.userId),
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async updateBodyMeasurement(
    @Arg("id", () => ID) id: string,
    @Arg("input", () => UpdateBodyMeasurementRecordInput)
    input: UpdateBodyMeasurementRecordInput,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.measurementService.updateMeasurement(
      requireAuthentication(context.userId),
      id,
      input,
    );
  }

  @Mutation(() => TrackingMutationResponseType)
  async deleteBodyMeasurement(
    @Arg("id", () => ID) id: string,
    @Ctx() context: TrackingContext,
  ): Promise<TrackingMutationResponse> {
    return this.measurementService.deleteMeasurement(
      requireAuthentication(context.userId),
      id,
    );
  }
}
