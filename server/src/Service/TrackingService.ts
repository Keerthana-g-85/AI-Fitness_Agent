import type { EntityManager } from "typeorm";
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
  WorkoutExerciseInput,
  WorkoutSessionInput,
} from "../Arguments/TrackingArguments";
import FoodIntake from "../Model/FoodIntake";
import Personalization from "../Model/Personalization";
import SleepRecord from "../Model/SleepRecord";
import SportsActivity from "../Model/SportsActivity";
import WaterIntake from "../Model/WaterIntake";
import WorkoutExercise from "../Model/WorkoutExercise";
import WorkoutSession from "../Model/WorkoutSession";
import type {
  DailyTrackingResponse,
  FoodIntakeResponse,
  SleepRecordResponse,
  SportsActivityResponse,
  TrackingMutationResponse,
  WaterIntakeResponse,
  WorkoutExerciseResponse,
  WorkoutSessionResponse,
} from "../Response/ProfileResponse";
import { database } from "../database";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const MEAL_TYPES = new Set(["breakfast", "lunch", "dinner", "snack"]);
const WORKOUT_TYPES = new Set([
  "strength",
  "cardio",
  "flexibility",
  "sports",
  "full_body",
  "other",
]);
const INTENSITIES = new Set(["low", "moderate", "high"]);
const SLEEP_QUALITIES = new Set(["poor", "fair", "good", "excellent"]);

class TrackingValidationError extends Error {}

const trimToNull = (value?: string | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
};

const text = (value: string | null, maxLength: number, label: string): string => {
  if (!value) {
    throw new TrackingValidationError(`${label} is required`);
  }

  if (value.length > maxLength) {
    throw new TrackingValidationError(
      `${label} must be ${maxLength} characters or fewer`,
    );
  }

  return value;
};

const optionalText = (
  value: string | null,
  maxLength: number,
  label: string,
): string | null => {
  if (value && value.length > maxLength) {
    throw new TrackingValidationError(
      `${label} must be ${maxLength} characters or fewer`,
    );
  }

  return value;
};

const mergeText = (
  incoming: string | null | undefined,
  existing: string | null | undefined,
): string | null => (incoming === undefined ? existing ?? null : trimToNull(incoming));

const mergeRequiredText = (
  incoming: string | null | undefined,
  existing: string | null | undefined,
): string => mergeText(incoming, existing) ?? "";

const toNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const mergeNumber = (
  incoming: number | null | undefined,
  existing: string | number | null | undefined,
): number | null => (incoming === undefined ? toNumber(existing) : incoming);

const decimal = (value: number | null | undefined): string | null =>
  value === null || value === undefined ? null : String(value);

const isValidDate = (value: string): boolean => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (year === undefined || month === undefined || day === undefined) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

const todayString = (): string => {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

const ensureDate = (value: string | null, label: string): string => {
  if (!value || !isValidDate(value) || value > todayString()) {
    throw new TrackingValidationError(`${label} must be a valid past or present date`);
  }

  return value;
};

const ensureNonNegative = (
  value: number | null,
  label: string,
  max = Number.MAX_SAFE_INTEGER,
): number => {
  if (value === null || !Number.isFinite(value) || value < 0 || value > max) {
    throw new TrackingValidationError(`${label} is invalid`);
  }

  return value;
};

const ensurePositiveInteger = (
  value: number | null,
  label: string,
  max = Number.MAX_SAFE_INTEGER,
): number => {
  if (
    value === null ||
    !Number.isInteger(value) ||
    value <= 0 ||
    value > max
  ) {
    throw new TrackingValidationError(`${label} must be a positive whole number`);
  }

  return value;
};

const ensureOptionalPositiveInteger = (
  value: number | null,
  label: string,
  max = Number.MAX_SAFE_INTEGER,
): number | null => {
  if (value !== null) {
    ensurePositiveInteger(value, label, max);
  }

  return value;
};

const ensureOptionalNumber = (
  value: number | null,
  label: string,
  max = Number.MAX_SAFE_INTEGER,
): number | null => {
  if (value !== null) {
    ensureNonNegative(value, label, max);
  }

  return value;
};

const ensureTime = (value: string | null, label: string): string | null => {
  if (value !== null && !TIME_REGEX.test(value)) {
    throw new TrackingValidationError(`Enter a valid ${label.toLowerCase()}`);
  }

  return value;
};

const toFoodResponse = (food: FoodIntake): FoodIntakeResponse => ({
  id: food.id,
  foodName: food.foodName,
  mealType: food.mealType,
  servingSize: food.servingSize ?? null,
  calories: toNumber(food.calories) ?? 0,
  proteinG: toNumber(food.proteinG),
  carbsG: toNumber(food.carbsG),
  fatG: toNumber(food.fatG),
  fiberG: toNumber(food.fiberG),
  consumedOn: food.consumedOn,
  notes: food.notes ?? null,
});

const toWaterResponse = (water: WaterIntake): WaterIntakeResponse => ({
  id: water.id,
  amountMl: water.amountMl,
  consumedOn: water.consumedOn,
  notes: water.notes ?? null,
  createdAt: water.createdAt,
});

const toExerciseResponse = (exercise: WorkoutExercise): WorkoutExerciseResponse => ({
  id: exercise.id,
  exerciseName: exercise.exerciseName,
  sets: exercise.sets ?? null,
  reps: exercise.reps ?? null,
  weightKg: toNumber(exercise.weightKg),
  durationMinutes: exercise.durationMinutes ?? null,
  distanceKm: toNumber(exercise.distanceKm),
  caloriesBurned: exercise.caloriesBurned ?? null,
});

const toWorkoutResponse = (workout: WorkoutSession): WorkoutSessionResponse => ({
  id: workout.id,
  name: workout.name,
  workoutType: workout.workoutType,
  performedOn: workout.performedOn,
  durationMinutes: workout.durationMinutes,
  caloriesBurned: workout.caloriesBurned ?? null,
  intensity: workout.intensity ?? null,
  notes: workout.notes ?? null,
  exercises: [...(workout.exercises ?? [])]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(toExerciseResponse),
});

const toSleepResponse = (sleep: SleepRecord): SleepRecordResponse => ({
  id: sleep.id,
  sleepDate: sleep.sleepDate,
  bedTime: sleep.bedTime ?? null,
  wakeTime: sleep.wakeTime ?? null,
  durationMinutes: sleep.durationMinutes,
  quality: sleep.quality ?? null,
  notes: sleep.notes ?? null,
});

const toSportResponse = (sport: SportsActivity): SportsActivityResponse => ({
  id: sport.id,
  sportName: sport.sportName,
  activityDate: sport.activityDate,
  durationMinutes: sport.durationMinutes,
  intensity: sport.intensity ?? null,
  caloriesBurned: sport.caloriesBurned ?? null,
  location: sport.location ?? null,
  notes: sport.notes ?? null,
});

const saveExercises = async (
  manager: EntityManager,
  sessionId: string,
  exercises: WorkoutExerciseInput[],
): Promise<void> => {
  const repository = manager.getRepository(WorkoutExercise);

  for (const [index, exercise] of exercises.entries()) {
    const exerciseName = trimToNull(exercise.exerciseName);

    text(exerciseName, 150, "Exercise name");

    const sets = ensureOptionalPositiveInteger(exercise.sets ?? null, "Sets", 1000);
    const reps = ensureOptionalPositiveInteger(exercise.reps ?? null, "Reps", 10000);
    const weightKg = ensureOptionalNumber(exercise.weightKg ?? null, "Weight", 2000);
    const durationMinutes = ensureOptionalPositiveInteger(
      exercise.durationMinutes ?? null,
      "Exercise duration",
      1440,
    );
    const distanceKm = ensureOptionalNumber(exercise.distanceKm ?? null, "Distance", 1000);
    const caloriesBurned = ensureOptionalPositiveInteger(
      exercise.caloriesBurned ?? null,
      "Exercise calories",
      100000,
    );

    await repository.save(
      repository.create({
        workoutSessionId: sessionId,
        exerciseName: exerciseName ?? "",
        sets,
        reps,
        weightKg: decimal(weightKg),
        durationMinutes,
        distanceKm: decimal(distanceKm),
        caloriesBurned,
        orderIndex: index,
      }),
    );
  }
};

export default class TrackingService {
  async getDailyTracking(
    authenticatedUserId: string | null | undefined,
    date: string,
  ): Promise<DailyTrackingResponse> {
    const userId = this.requireUserId(authenticatedUserId);
    const trackingDate = ensureDate(date, "Tracking date");

    const [food, water, workouts, sleep, sports, personalization] =
      await Promise.all([
        database.getRepository(FoodIntake).find({
          where: { userId, consumedOn: trackingDate },
          order: { createdAt: "ASC" },
        }),
        database.getRepository(WaterIntake).find({
          where: { userId, consumedOn: trackingDate },
          order: { createdAt: "ASC" },
        }),
        database.getRepository(WorkoutSession).find({
          where: { userId, performedOn: trackingDate },
          relations: { exercises: true },
          order: { createdAt: "ASC" },
        }),
        database.getRepository(SleepRecord).findOne({
          where: { userId, sleepDate: trackingDate },
        }),
        database.getRepository(SportsActivity).find({
          where: { userId, activityDate: trackingDate },
          order: { createdAt: "ASC" },
        }),
        database.getRepository(Personalization).findOne({ where: { userId } }),
      ]);

    return {
      date: trackingDate,
      foodIntakes: food.map(toFoodResponse),
      waterIntakes: water.map(toWaterResponse),
      workouts: workouts.map(toWorkoutResponse),
      sleepRecord: sleep ? toSleepResponse(sleep) : null,
      sportsActivities: sports.map(toSportResponse),
      totalCaloriesConsumed: food.reduce(
        (total, item) => total + (toNumber(item.calories) ?? 0),
        0,
      ),
      totalWaterMl: water.reduce((total, item) => total + item.amountMl, 0),
      totalWorkoutCalories: workouts.reduce(
        (total, item) => total + (item.caloriesBurned ?? 0),
        0,
      ),
      totalSportCalories: sports.reduce(
        (total, item) => total + (item.caloriesBurned ?? 0),
        0,
      ),
      dailyWaterTargetMl: personalization?.dailyWaterTargetMl ?? null,
      sleepGoalMinutes: personalization?.sleepGoalMinutes ?? null,
    };
  }

  async addFoodIntake(
    authenticatedUserId: string | null | undefined,
    input: FoodIntakeInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(FoodIntake);
      const values = this.foodValues(input, null);
      const record = await repository.save(repository.create({ userId, ...values }));

      return { success: true, message: "Food added", id: record.id };
    });
  }

  async updateFoodIntake(
    authenticatedUserId: string | null | undefined,
    id: string,
    input: UpdateFoodIntakeInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(FoodIntake);
      const existing = await this.findOwned(repository, id, userId, "Food entry");

      const values = this.foodValues(input, existing);

      Object.assign(existing, values);
      await repository.save(existing);

      return { success: true, message: "Food updated", id: existing.id };
    });
  }

  async deleteFoodIntake(
    authenticatedUserId: string | null | undefined,
    id: string,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(FoodIntake);
      const existing = await this.findOwned(repository, id, userId, "Food entry");

      await repository.remove(existing);

      return { success: true, message: "Food removed", id };
    });
  }

  async addWaterIntake(
    authenticatedUserId: string | null | undefined,
    input: WaterIntakeInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(WaterIntake);
      const record = await repository.save(
        repository.create({ userId, ...this.waterValues(input, null) }),
      );

      return { success: true, message: "Water logged", id: record.id };
    });
  }

  async updateWaterIntake(
    authenticatedUserId: string | null | undefined,
    id: string,
    input: UpdateWaterIntakeInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(WaterIntake);
      const existing = await this.findOwned(repository, id, userId, "Water entry");

      Object.assign(existing, this.waterValues(input, existing));
      await repository.save(existing);

      return { success: true, message: "Water updated", id };
    });
  }

  async deleteWaterIntake(
    authenticatedUserId: string | null | undefined,
    id: string,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(WaterIntake);
      const existing = await this.findOwned(repository, id, userId, "Water entry");

      await repository.remove(existing);

      return { success: true, message: "Water removed", id };
    });
  }

  async addWorkout(
    authenticatedUserId: string | null | undefined,
    input: WorkoutSessionInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      return database.transaction(async (manager) => {
        const repository = manager.getRepository(WorkoutSession);
        const values = this.workoutValues(input, null);
        const session = await repository.save(repository.create({ userId, ...values }));

        await saveExercises(manager, session.id, input.exercises ?? []);

        return { success: true, message: "Workout saved", id: session.id };
      });
    });
  }

  async updateWorkout(
    authenticatedUserId: string | null | undefined,
    id: string,
    input: UpdateWorkoutSessionInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      return database.transaction(async (manager) => {
        const repository = manager.getRepository(WorkoutSession);
        const existing = await this.findOwned(repository, id, userId, "Workout");
        const exercises = await manager.getRepository(WorkoutExercise).find({
          where: { workoutSessionId: id },
          order: { orderIndex: "ASC" },
        });

        Object.assign(existing, this.workoutValues(input, existing));
        await repository.save(existing);

        if (input.exercises !== undefined) {
          await manager.getRepository(WorkoutExercise).remove(exercises);
          await saveExercises(manager, id, input.exercises ?? []);
        }

        return { success: true, message: "Workout updated", id };
      });
    });
  }

  async deleteWorkout(
    authenticatedUserId: string | null | undefined,
    id: string,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(WorkoutSession);
      const existing = await this.findOwned(repository, id, userId, "Workout");

      await repository.remove(existing);

      return { success: true, message: "Workout removed", id };
    });
  }

  async saveSleep(
    authenticatedUserId: string | null | undefined,
    input: SleepRecordInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(SleepRecord);
      const values = this.sleepValues(input, null);
      const existing = await repository.findOne({
        where: { userId, sleepDate: values.sleepDate },
      });

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);

        return { success: true, message: "Sleep updated", id: existing.id };
      }

      const record = await repository.save(repository.create({ userId, ...values }));

      return { success: true, message: "Sleep saved", id: record.id };
    });
  }

  async updateSleep(
    authenticatedUserId: string | null | undefined,
    id: string,
    input: UpdateSleepRecordInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(SleepRecord);
      const existing = await this.findOwned(repository, id, userId, "Sleep record");
      const values = this.sleepValues(input, existing);

      const duplicate = await repository.findOne({
        where: { userId, sleepDate: values.sleepDate },
      });

      if (duplicate && duplicate.id !== existing.id) {
        throw new TrackingValidationError("Sleep is already logged for that date");
      }

      Object.assign(existing, values);
      await repository.save(existing);

      return { success: true, message: "Sleep updated", id };
    });
  }

  async deleteSleep(
    authenticatedUserId: string | null | undefined,
    id: string,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(SleepRecord);
      const existing = await this.findOwned(repository, id, userId, "Sleep record");

      await repository.remove(existing);

      return { success: true, message: "Sleep removed", id };
    });
  }

  async addSportsActivity(
    authenticatedUserId: string | null | undefined,
    input: SportsActivityInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(SportsActivity);
      const record = await repository.save(
        repository.create({ userId, ...this.sportValues(input, null) }),
      );

      return { success: true, message: "Sports activity saved", id: record.id };
    });
  }

  async updateSportsActivity(
    authenticatedUserId: string | null | undefined,
    id: string,
    input: UpdateSportsActivityInput,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(SportsActivity);
      const existing = await this.findOwned(repository, id, userId, "Sports activity");

      Object.assign(existing, this.sportValues(input, existing));
      await repository.save(existing);

      return { success: true, message: "Sports activity updated", id };
    });
  }

  async deleteSportsActivity(
    authenticatedUserId: string | null | undefined,
    id: string,
  ): Promise<TrackingMutationResponse> {
    return this.mutate(authenticatedUserId, async (userId) => {
      const repository = database.getRepository(SportsActivity);
      const existing = await this.findOwned(repository, id, userId, "Sports activity");

      await repository.remove(existing);

      return { success: true, message: "Sports activity removed", id };
    });
  }

  private requireUserId(userId: string | null | undefined): string {
    if (!userId || !UUID_REGEX.test(userId)) {
      throw new TrackingValidationError("Authentication required");
    }

    return userId;
  }

  private async mutate(
    authenticatedUserId: string | null | undefined,
    operation: (userId: string) => Promise<TrackingMutationResponse>,
  ): Promise<TrackingMutationResponse> {
    try {
      return await operation(this.requireUserId(authenticatedUserId));
    } catch (error) {
      if (error instanceof TrackingValidationError) {
        return { success: false, message: error.message };
      }

      console.error("Tracking operation failed:", error);

      return {
        success: false,
        message: "Unable to save your tracking data. Please try again.",
      };
    }
  }

  private async findOwned<T extends { id: string }>(
    repository: { findOne: (options: object) => Promise<T | null> },
    id: string,
    userId: string,
    label: string,
  ): Promise<T> {
    if (!UUID_REGEX.test(id)) {
      throw new TrackingValidationError(`Invalid ${label.toLowerCase()}`);
    }

    const record = await repository.findOne({ where: { id, userId } });

    if (!record) {
      throw new TrackingValidationError(`${label} not found`);
    }

    return record;
  }

  private foodValues(
    input: FoodIntakeInput | UpdateFoodIntakeInput,
    existing: FoodIntake | null,
  ) {
    const foodName = text(
      mergeRequiredText(input.foodName, existing?.foodName),
      200,
      "Food name",
    );
    const mealType = mergeRequiredText(input.mealType, existing?.mealType);

    if (!MEAL_TYPES.has(mealType)) {
      throw new TrackingValidationError("Select a valid meal type");
    }

    const calories = ensureNonNegative(
      mergeNumber(input.calories, existing?.calories),
      "Calories",
      100000,
    );
    const proteinG = ensureOptionalNumber(
      mergeNumber(input.proteinG, existing?.proteinG),
      "Protein",
      10000,
    );
    const carbsG = ensureOptionalNumber(
      mergeNumber(input.carbsG, existing?.carbsG),
      "Carbohydrates",
      10000,
    );
    const fatG = ensureOptionalNumber(
      mergeNumber(input.fatG, existing?.fatG),
      "Fat",
      10000,
    );
    const fiberG = ensureOptionalNumber(
      mergeNumber(input.fiberG, existing?.fiberG),
      "Fiber",
      10000,
    );

    return {
      foodName,
      mealType,
      servingSize: optionalText(
        mergeText(input.servingSize, existing?.servingSize),
        100,
        "Serving size",
      ),
      calories: decimal(calories) ?? "0",
      proteinG: decimal(proteinG),
      carbsG: decimal(carbsG),
      fatG: decimal(fatG),
      fiberG: decimal(fiberG),
      consumedOn: ensureDate(
        mergeRequiredText(input.consumedOn, existing?.consumedOn),
        "Meal date",
      ),
      notes: optionalText(mergeText(input.notes, existing?.notes), 2000, "Notes"),
    };
  }

  private waterValues(
    input: WaterIntakeInput | UpdateWaterIntakeInput,
    existing: WaterIntake | null,
  ) {
    const amountMl = ensurePositiveInteger(
      mergeNumber(input.amountMl, existing?.amountMl),
      "Water amount",
      10000,
    );

    return {
      amountMl,
      consumedOn: ensureDate(
        mergeRequiredText(input.consumedOn, existing?.consumedOn),
        "Water date",
      ),
      notes: optionalText(mergeText(input.notes, existing?.notes), 2000, "Notes"),
    };
  }

  private workoutValues(
    input: WorkoutSessionInput | UpdateWorkoutSessionInput,
    existing: WorkoutSession | null,
  ) {
    const name = text(
      mergeRequiredText(input.name, existing?.name),
      150,
      "Workout name",
    );
    const workoutType = mergeRequiredText(
      input.workoutType,
      existing?.workoutType,
    );

    if (!WORKOUT_TYPES.has(workoutType)) {
      throw new TrackingValidationError("Select a valid workout type");
    }

    const durationMinutes = ensurePositiveInteger(
      mergeNumber(input.durationMinutes, existing?.durationMinutes),
      "Workout duration",
      1440,
    );
    const caloriesBurned = ensureOptionalPositiveInteger(
      mergeNumber(input.caloriesBurned, existing?.caloriesBurned),
      "Calories burned",
      100000,
    );
    const intensity = mergeText(input.intensity, existing?.intensity);

    if (intensity !== null && !INTENSITIES.has(intensity)) {
      throw new TrackingValidationError("Select a valid workout intensity");
    }

    return {
      name,
      workoutType,
      performedOn: ensureDate(
        mergeRequiredText(input.performedOn, existing?.performedOn),
        "Workout date",
      ),
      durationMinutes,
      caloriesBurned,
      intensity,
      notes: optionalText(mergeText(input.notes, existing?.notes), 2000, "Notes"),
    };
  }

  private sleepValues(
    input: SleepRecordInput | UpdateSleepRecordInput,
    existing: SleepRecord | null,
  ) {
    const durationMinutes = ensurePositiveInteger(
      mergeNumber(input.durationMinutes, existing?.durationMinutes),
      "Sleep duration",
      1440,
    );
    const quality = mergeText(input.quality, existing?.quality);

    if (quality !== null && !SLEEP_QUALITIES.has(quality)) {
      throw new TrackingValidationError("Select a valid sleep quality");
    }

    return {
      sleepDate: ensureDate(
        mergeRequiredText(input.sleepDate, existing?.sleepDate),
        "Sleep date",
      ),
      bedTime: ensureTime(mergeText(input.bedTime, existing?.bedTime), "Bed time"),
      wakeTime: ensureTime(
        mergeText(input.wakeTime, existing?.wakeTime),
        "Wake time",
      ),
      durationMinutes,
      quality,
      notes: optionalText(mergeText(input.notes, existing?.notes), 2000, "Notes"),
    };
  }

  private sportValues(
    input: SportsActivityInput | UpdateSportsActivityInput,
    existing: SportsActivity | null,
  ) {
    const sportName = text(
      mergeRequiredText(input.sportName, existing?.sportName),
      100,
      "Sport name",
    );
    const durationMinutes = ensurePositiveInteger(
      mergeNumber(input.durationMinutes, existing?.durationMinutes),
      "Activity duration",
      1440,
    );
    const intensity = mergeText(input.intensity, existing?.intensity);

    if (intensity !== null && !INTENSITIES.has(intensity)) {
      throw new TrackingValidationError("Select a valid activity intensity");
    }

    const caloriesBurned = ensureOptionalPositiveInteger(
      mergeNumber(input.caloriesBurned, existing?.caloriesBurned),
      "Calories burned",
      100000,
    );

    return {
      sportName,
      activityDate: ensureDate(
        mergeRequiredText(input.activityDate, existing?.activityDate),
        "Activity date",
      ),
      durationMinutes,
      intensity,
      caloriesBurned,
      location: optionalText(
        mergeText(input.location, existing?.location),
        120,
        "Location",
      ),
      notes: optionalText(mergeText(input.notes, existing?.notes), 2000, "Notes"),
    };
  }
}
