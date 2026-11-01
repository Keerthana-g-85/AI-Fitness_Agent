import type {
  BodyCompositionProfile,
  BodyMeasurementProfile,
} from "./profile";

export interface FoodIntake {
  id: string;
  foodName: string;
  mealType: string;
  servingSize?: string | null;
  calories: number;
  proteinG?: number | null;
  carbsG?: number | null;
  fatG?: number | null;
  fiberG?: number | null;
  consumedOn: string;
  notes?: string | null;
}

export interface WaterIntake {
  id: string;
  amountMl: number;
  consumedOn: string;
  notes?: string | null;
  createdAt: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseName: string;
  sets?: number | null;
  reps?: number | null;
  weightKg?: number | null;
  durationMinutes?: number | null;
  distanceKm?: number | null;
  caloriesBurned?: number | null;
}

export interface WorkoutSession {
  id: string;
  name: string;
  workoutType: string;
  performedOn: string;
  durationMinutes: number;
  caloriesBurned?: number | null;
  intensity?: string | null;
  notes?: string | null;
  exercises: WorkoutExercise[];
}

export interface SleepRecord {
  id: string;
  sleepDate: string;
  bedTime?: string | null;
  wakeTime?: string | null;
  durationMinutes: number;
  quality?: string | null;
  notes?: string | null;
}

export interface SportsActivity {
  id: string;
  sportName: string;
  activityDate: string;
  durationMinutes: number;
  intensity?: string | null;
  caloriesBurned?: number | null;
  location?: string | null;
  notes?: string | null;
}

export interface DailyTracking {
  date: string;
  foodIntakes: FoodIntake[];
  waterIntakes: WaterIntake[];
  workouts: WorkoutSession[];
  sleepRecord?: SleepRecord | null;
  sportsActivities: SportsActivity[];
  totalCaloriesConsumed: number;
  totalWaterMl: number;
  totalWorkoutCalories: number;
  totalSportCalories: number;
  dailyWaterTargetMl?: number | null;
  sleepGoalMinutes?: number | null;
}

export interface MeasurementRecord extends BodyMeasurementProfile {
  createdAt: string;
  composition?: BodyCompositionProfile | null;
}

export interface TrackingMutationResult {
  success: boolean;
  message: string;
  id?: string | null;
}

export interface FoodIntakeInput {
  foodName: string;
  mealType: string;
  servingSize?: string | null;
  calories: number;
  proteinG?: number | null;
  carbsG?: number | null;
  fatG?: number | null;
  fiberG?: number | null;
  consumedOn: string;
  notes?: string | null;
}

export type UpdateFoodIntakeInput = Partial<FoodIntakeInput>;

export interface WaterIntakeInput {
  amountMl: number;
  consumedOn: string;
  notes?: string | null;
}

export type UpdateWaterIntakeInput = Partial<WaterIntakeInput>;

export interface WorkoutExerciseInput {
  exerciseName: string;
  sets?: number | null;
  reps?: number | null;
  weightKg?: number | null;
  durationMinutes?: number | null;
  distanceKm?: number | null;
  caloriesBurned?: number | null;
}

export interface WorkoutSessionInput {
  name: string;
  workoutType: string;
  performedOn: string;
  durationMinutes: number;
  caloriesBurned?: number | null;
  intensity?: string | null;
  notes?: string | null;
  exercises?: WorkoutExerciseInput[] | null;
}

export type UpdateWorkoutSessionInput = Partial<WorkoutSessionInput>;

export interface SleepRecordInput {
  sleepDate: string;
  bedTime?: string | null;
  wakeTime?: string | null;
  durationMinutes: number;
  quality?: string | null;
  notes?: string | null;
}

export type UpdateSleepRecordInput = Partial<SleepRecordInput>;

export interface SportsActivityInput {
  sportName: string;
  activityDate: string;
  durationMinutes: number;
  intensity?: string | null;
  caloriesBurned?: number | null;
  location?: string | null;
  notes?: string | null;
}

export type UpdateSportsActivityInput = Partial<SportsActivityInput>;

export interface BodyCompositionRecordInput {
  bodyFatPercentage?: number | null;
  fatMassKg?: number | null;
  muscleMassKg?: number | null;
  skeletalMuscleMassKg?: number | null;
  leanBodyMassKg?: number | null;
  bodyWaterPercentage?: number | null;
  totalBodyWaterLiters?: number | null;
  visceralFat?: number | null;
  boneMassKg?: number | null;
  proteinPercentage?: number | null;
  bmrKcal?: number | null;
  bmi?: number | null;
  metabolicAge?: number | null;
  source?: string | null;
}

export interface AddBodyMeasurementInput
  extends Omit<BodyMeasurementProfile, "id" | "createdAt"> {
  measuredAt: string;
  composition?: BodyCompositionRecordInput | null;
}

export type UpdateBodyMeasurementInput = Partial<
  Omit<AddBodyMeasurementInput, "measuredAt">
> & { measuredAt?: string | null };
