import { Field, Float, ID, Int, ObjectType } from "type-graphql";
import { AuthUserResponse } from "./LoginResponse";

@ObjectType()
export class BasicProfileResponse {
  @Field(() => String)
  dateOfBirth!: string;

  @Field(() => Float)
  heightCm!: number;

  @Field(() => String)
  gender!: string;

  @Field(() => String, { nullable: true })
  occupation?: string | null;

  @Field(() => String)
  country!: string;

  @Field(() => String)
  activityLevel!: string;
}

@ObjectType()
export class FitnessGoalResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  primaryGoal!: string;

  @Field(() => String, { nullable: true })
  secondaryGoal?: string | null;

  @Field(() => Float)
  currentWeightKg!: number;

  @Field(() => Float, { nullable: true })
  targetWeightKg?: number | null;

  @Field(() => Float, { nullable: true })
  targetBodyFatPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  targetMuscleMassKg?: number | null;

  @Field(() => String, { nullable: true })
  targetDate?: string | null;
}

@ObjectType()
export class BodyMeasurementResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => Float, { nullable: true })
  weightKg?: number | null;

  @Field(() => Float, { nullable: true })
  neckCm?: number | null;

  @Field(() => Float, { nullable: true })
  shoulderCm?: number | null;

  @Field(() => Float, { nullable: true })
  chestCm?: number | null;

  @Field(() => Float, { nullable: true })
  bustCm?: number | null;

  @Field(() => Float, { nullable: true })
  waistCm?: number | null;

  @Field(() => Float, { nullable: true })
  abdomenCm?: number | null;

  @Field(() => Float, { nullable: true })
  hipCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightArmCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightThighCm?: number | null;

  @Field(() => Float, { nullable: true })
  leftCalfCm?: number | null;

  @Field(() => Float, { nullable: true })
  rightCalfCm?: number | null;

  @Field(() => Float, { nullable: true })
  heightCm?: number | null;

  @Field(() => String, { nullable: true })
  source?: string | null;

  @Field(() => String, { nullable: true })
  measuredAt?: string | null;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class BodyCompositionResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => Float, { nullable: true })
  bodyFatPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  fatMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  muscleMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  skeletalMuscleMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  leanBodyMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  bodyWaterPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  totalBodyWaterLiters?: number | null;

  @Field(() => Int, { nullable: true })
  visceralFat?: number | null;

  @Field(() => Float, { nullable: true })
  boneMassKg?: number | null;

  @Field(() => Float, { nullable: true })
  proteinPercentage?: number | null;

  @Field(() => Int, { nullable: true })
  bmrKcal?: number | null;

  @Field(() => Float, { nullable: true })
  bmi?: number | null;

  @Field(() => Int, { nullable: true })
  metabolicAge?: number | null;

  @Field(() => String, { nullable: true })
  source?: string | null;

  @Field(() => String, { nullable: true })
  measuredAt?: string | null;
}

@ObjectType()
export class MedicalHistoryResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  conditionName!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Boolean)
  isActive!: boolean;

  @Field(() => String, { nullable: true })
  doctorAdvice?: string | null;

  @Field(() => String, { nullable: true })
  treatmentDetails?: string | null;

  @Field(() => String, { nullable: true })
  diagnosisDate?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class MedicationResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  medicineName!: string;

  @Field(() => String, { nullable: true })
  dosage?: string | null;

  @Field(() => String, { nullable: true })
  frequency?: string | null;

  @Field(() => String, { nullable: true })
  startDate?: string | null;

  @Field(() => String, { nullable: true })
  endDate?: string | null;

  @Field(() => String, { nullable: true })
  reasonForTaking?: string | null;

  @Field(() => Boolean)
  doctorPrescribed!: boolean;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class AllergyResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  allergyName!: string;

  @Field(() => String, { nullable: true })
  allergyType?: string | null;

  @Field(() => String, { nullable: true })
  severity?: string | null;

  @Field(() => String, { nullable: true })
  reaction?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class FoodPreferenceResponse {
  @Field(() => String)
  dietType!: string;

  @Field(() => [String])
  preferredCuisine!: string[];

  @Field(() => [String])
  foodAllergies!: string[];

  @Field(() => String, { nullable: true })
  otherFoodAllergy?: string | null;

  @Field(() => [String])
  foodIntolerances!: string[];

  @Field(() => String, { nullable: true })
  otherFoodIntolerance?: string | null;

  @Field(() => [String])
  dislikedFoods!: string[];

  @Field(() => [String])
  favouriteFoods!: string[];

  @Field(() => Float, { nullable: true })
  dailyFoodBudget?: number | null;

  @Field(() => String)
  cookingPreference!: string;

  @Field(() => Int, { nullable: true })
  cookingTime?: number | null;
}

@ObjectType()
export class EatingHabitResponse {
  @Field(() => String)
  mealsPerDay!: string;

  @Field(() => String, { nullable: true })
  breakfastTime?: string | null;

  @Field(() => String, { nullable: true })
  lunchTime?: string | null;

  @Field(() => String, { nullable: true })
  dinnerTime?: string | null;

  @Field(() => Boolean)
  eatsSnacks!: boolean;

  @Field(() => Boolean)
  frequentlyEatsOutside!: boolean;

  @Field(() => Boolean)
  prefersHomemadeFood!: boolean;

  @Field(() => Boolean)
  followsIntermittentFasting!: boolean;

  @Field(() => String, { nullable: true })
  fastingWindow?: string | null;
}

@ObjectType()
export class FoodAvailabilityResponse {
  @Field(() => [String])
  availableIngredients!: string[];

  @Field(() => String, { nullable: true })
  otherIngredients?: string | null;
}

@ObjectType()
export class WorkoutPreferenceResponse {
  @Field(() => String)
  fitnessLevel!: string;

  @Field(() => String)
  workoutExperience!: string;

  @Field(() => String)
  workoutLocation!: string;

  @Field(() => Boolean)
  gymMembership!: boolean;

  @Field(() => [String])
  availableEquipment!: string[];

  @Field(() => String, { nullable: true })
  otherEquipment?: string | null;

  @Field(() => [String])
  preferredWorkouts!: string[];

  @Field(() => [String])
  preferredSports!: string[];
}

@ObjectType()
export class WorkoutScheduleResponse {
  @Field(() => Int)
  workoutDaysPerWeek!: number;

  @Field(() => String)
  workoutDuration!: string;

  @Field(() => String)
  preferredWorkoutTime!: string;

  @Field(() => [String])
  restDays!: string[];

  @Field(() => String)
  preferredIntensity!: string;
}

@ObjectType()
export class ExerciseRestrictionResponse {
  @Field(() => String, { nullable: true })
  currentInjuries?: string | null;

  @Field(() => Boolean)
  experiencesJointPain!: boolean;

  @Field(() => String, { nullable: true })
  restrictedExercises?: string | null;

  @Field(() => String, { nullable: true })
  dislikedExercises?: string | null;

  @Field(() => String, { nullable: true })
  doctorExerciseRestrictions?: string | null;
}

@ObjectType()
export class WorkLifeResponse {
  @Field(() => String)
  workType!: string;

  @Field(() => String, { nullable: true })
  workStartTime?: string | null;

  @Field(() => String, { nullable: true })
  workEndTime?: string | null;

  @Field(() => [String])
  workingDays!: string[];

  @Field(() => Float, { nullable: true })
  dailySittingHours?: number | null;

  @Field(() => Float, { nullable: true })
  dailyStandingHours?: number | null;

  @Field(() => Int, { nullable: true })
  dailyCommuteTime?: number | null;

  @Field(() => String)
  sleepTime!: string;

  @Field(() => String)
  wakeUpTime!: string;

  @Field(() => String, { nullable: true })
  stressLevel?: string | null;

  @Field(() => String)
  freeTime!: string;
}

@ObjectType()
export class PersonalizationResponse {
  @Field(() => Boolean)
  reminderPreference!: boolean;

  @Field(() => Boolean)
  waterReminder!: boolean;

  @Field(() => Boolean)
  mealReminder!: boolean;

  @Field(() => Boolean)
  workoutReminder!: boolean;

  @Field(() => String)
  preferredLanguage!: string;

  @Field(() => String)
  coachingStyle!: string;

  @Field(() => String)
  notificationFrequency!: string;

  @Field(() => Int, { nullable: true })
  dailyWaterTargetMl?: number | null;

  @Field(() => Int, { nullable: true })
  sleepGoalMinutes?: number | null;
}

@ObjectType()
export default class ProfileResponse {
  @Field(() => AuthUserResponse)
  user!: AuthUserResponse;

  @Field(() => BasicProfileResponse, { nullable: true })
  profile?: BasicProfileResponse | null;

  @Field(() => FitnessGoalResponse, { nullable: true })
  fitnessGoal?: FitnessGoalResponse | null;

  @Field(() => BodyMeasurementResponse, { nullable: true })
  latestBodyMeasurement?: BodyMeasurementResponse | null;

  @Field(() => BodyCompositionResponse, { nullable: true })
  latestBodyComposition?: BodyCompositionResponse | null;

  @Field(() => [MedicalHistoryResponse])
  medicalHistories!: MedicalHistoryResponse[];

  @Field(() => [MedicationResponse])
  medications!: MedicationResponse[];

  @Field(() => [AllergyResponse])
  allergies!: AllergyResponse[];

  @Field(() => FoodPreferenceResponse, { nullable: true })
  foodPreferences?: FoodPreferenceResponse | null;

  @Field(() => EatingHabitResponse, { nullable: true })
  eatingHabits?: EatingHabitResponse | null;

  @Field(() => FoodAvailabilityResponse, { nullable: true })
  foodAvailability?: FoodAvailabilityResponse | null;

  @Field(() => WorkoutPreferenceResponse, { nullable: true })
  workoutPreferences?: WorkoutPreferenceResponse | null;

  @Field(() => WorkoutScheduleResponse, { nullable: true })
  workoutSchedule?: WorkoutScheduleResponse | null;

  @Field(() => ExerciseRestrictionResponse, { nullable: true })
  exerciseRestrictions?: ExerciseRestrictionResponse | null;

  @Field(() => WorkLifeResponse, { nullable: true })
  workLife?: WorkLifeResponse | null;

  @Field(() => PersonalizationResponse, { nullable: true })
  personalization?: PersonalizationResponse | null;
}

@ObjectType()
export class DashboardResponse {
  @Field(() => AuthUserResponse)
  user!: AuthUserResponse;

  @Field(() => BasicProfileResponse, { nullable: true })
  profile?: BasicProfileResponse | null;

  @Field(() => FitnessGoalResponse, { nullable: true })
  fitnessGoal?: FitnessGoalResponse | null;

  @Field(() => BodyMeasurementResponse, { nullable: true })
  latestBodyMeasurement?: BodyMeasurementResponse | null;

  @Field(() => BodyCompositionResponse, { nullable: true })
  latestBodyComposition?: BodyCompositionResponse | null;
}

@ObjectType()
export class UpdateProfileResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class BodyMeasurementHistoryResponse extends BodyMeasurementResponse {
  @Field(() => BodyCompositionResponse, { nullable: true })
  composition?: BodyCompositionResponse | null;
}

@ObjectType()
export class FoodIntakeResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  foodName!: string;

  @Field(() => String)
  mealType!: string;

  @Field(() => String, { nullable: true })
  servingSize?: string | null;

  @Field(() => Float)
  calories!: number;

  @Field(() => Float, { nullable: true })
  proteinG?: number | null;

  @Field(() => Float, { nullable: true })
  carbsG?: number | null;

  @Field(() => Float, { nullable: true })
  fatG?: number | null;

  @Field(() => Float, { nullable: true })
  fiberG?: number | null;

  @Field(() => String)
  consumedOn!: string;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class WaterIntakeResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => Int)
  amountMl!: number;

  @Field(() => String)
  consumedOn!: string;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => Date)
  createdAt!: Date;
}

@ObjectType()
export class WorkoutExerciseResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  exerciseName!: string;

  @Field(() => Int, { nullable: true })
  sets?: number | null;

  @Field(() => Int, { nullable: true })
  reps?: number | null;

  @Field(() => Float, { nullable: true })
  weightKg?: number | null;

  @Field(() => Int, { nullable: true })
  durationMinutes?: number | null;

  @Field(() => Float, { nullable: true })
  distanceKm?: number | null;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;
}

@ObjectType()
export class WorkoutSessionResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  workoutType!: string;

  @Field(() => String)
  performedOn!: string;

  @Field(() => Int)
  durationMinutes!: number;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;

  @Field(() => String, { nullable: true })
  intensity?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;

  @Field(() => [WorkoutExerciseResponse])
  exercises!: WorkoutExerciseResponse[];
}

@ObjectType()
export class SleepRecordResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  sleepDate!: string;

  @Field(() => String, { nullable: true })
  bedTime?: string | null;

  @Field(() => String, { nullable: true })
  wakeTime?: string | null;

  @Field(() => Int)
  durationMinutes!: number;

  @Field(() => String, { nullable: true })
  quality?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class SportsActivityResponse {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  sportName!: string;

  @Field(() => String)
  activityDate!: string;

  @Field(() => Int)
  durationMinutes!: number;

  @Field(() => String, { nullable: true })
  intensity?: string | null;

  @Field(() => Int, { nullable: true })
  caloriesBurned?: number | null;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@ObjectType()
export class DailyTrackingResponse {
  @Field(() => String)
  date!: string;

  @Field(() => [FoodIntakeResponse])
  foodIntakes!: FoodIntakeResponse[];

  @Field(() => [WaterIntakeResponse])
  waterIntakes!: WaterIntakeResponse[];

  @Field(() => [WorkoutSessionResponse])
  workouts!: WorkoutSessionResponse[];

  @Field(() => SleepRecordResponse, { nullable: true })
  sleepRecord?: SleepRecordResponse | null;

  @Field(() => [SportsActivityResponse])
  sportsActivities!: SportsActivityResponse[];

  @Field(() => Float)
  totalCaloriesConsumed!: number;

  @Field(() => Int)
  totalWaterMl!: number;

  @Field(() => Int)
  totalWorkoutCalories!: number;

  @Field(() => Int)
  totalSportCalories!: number;

  @Field(() => Int, { nullable: true })
  dailyWaterTargetMl?: number | null;

  @Field(() => Int, { nullable: true })
  sleepGoalMinutes?: number | null;
}

@ObjectType()
export class TrackingMutationResponse {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => String)
  message!: string;

  @Field(() => ID, { nullable: true })
  id?: string | null;
}
