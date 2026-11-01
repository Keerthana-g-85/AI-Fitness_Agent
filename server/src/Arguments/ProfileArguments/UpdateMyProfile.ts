import { Field, Float, InputType, Int } from "type-graphql";

@InputType()
export class UpdateBasicProfileInput {
  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  email?: string | null;

  @Field(() => String, { nullable: true })
  dateOfBirth?: string | null;

  @Field(() => Float, { nullable: true })
  heightCm?: number | null;

  @Field(() => String, { nullable: true })
  gender?: string | null;

  @Field(() => String, { nullable: true })
  occupation?: string | null;

  @Field(() => String, { nullable: true })
  country?: string | null;

  @Field(() => String, { nullable: true })
  activityLevel?: string | null;
}

@InputType()
export class UpdateFitnessGoalInput {
  @Field(() => String, { nullable: true })
  primaryGoal?: string | null;

  @Field(() => String, { nullable: true })
  secondaryGoal?: string | null;

  @Field(() => Float, { nullable: true })
  currentWeightKg?: number | null;

  @Field(() => Float, { nullable: true })
  targetWeightKg?: number | null;

  @Field(() => Float, { nullable: true })
  targetBodyFatPercentage?: number | null;

  @Field(() => Float, { nullable: true })
  targetMuscleMassKg?: number | null;

  @Field(() => String, { nullable: true })
  targetDate?: string | null;
}

@InputType()
export class UpdateBodyMeasurementInput {
  @Field(() => String, { nullable: true })
  id?: string | null;

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

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateBodyCompositionInput {
  @Field(() => String, { nullable: true })
  id?: string | null;

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

@InputType()
export class UpdateMedicalHistoryInput {
  @Field(() => String, { nullable: true })
  id?: string | null;

  @Field(() => String, { nullable: true })
  conditionName?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean | null;

  @Field(() => String, { nullable: true })
  doctorAdvice?: string | null;

  @Field(() => String, { nullable: true })
  treatmentDetails?: string | null;

  @Field(() => String, { nullable: true })
  diagnosisDate?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateMedicationInput {
  @Field(() => String, { nullable: true })
  id?: string | null;

  @Field(() => String, { nullable: true })
  medicineName?: string | null;

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

  @Field(() => Boolean, { nullable: true })
  doctorPrescribed?: boolean | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateAllergyInput {
  @Field(() => String, { nullable: true })
  id?: string | null;

  @Field(() => String, { nullable: true })
  allergyName?: string | null;

  @Field(() => String, { nullable: true })
  allergyType?: string | null;

  @Field(() => String, { nullable: true })
  severity?: string | null;

  @Field(() => String, { nullable: true })
  reaction?: string | null;

  @Field(() => String, { nullable: true })
  notes?: string | null;
}

@InputType()
export class UpdateFoodPreferencesInput {
  @Field(() => String, { nullable: true })
  dietType?: string | null;

  @Field(() => [String], { nullable: true })
  preferredCuisine?: string[] | null;

  @Field(() => [String], { nullable: true })
  foodAllergies?: string[] | null;

  @Field(() => String, { nullable: true })
  otherFoodAllergy?: string | null;

  @Field(() => [String], { nullable: true })
  foodIntolerances?: string[] | null;

  @Field(() => String, { nullable: true })
  otherFoodIntolerance?: string | null;

  @Field(() => [String], { nullable: true })
  dislikedFoods?: string[] | null;

  @Field(() => [String], { nullable: true })
  favouriteFoods?: string[] | null;

  @Field(() => Float, { nullable: true })
  dailyFoodBudget?: number | null;

  @Field(() => String, { nullable: true })
  cookingPreference?: string | null;

  @Field(() => Int, { nullable: true })
  cookingTime?: number | null;
}

@InputType()
export class UpdateEatingHabitsInput {
  @Field(() => String, { nullable: true })
  mealsPerDay?: string | null;

  @Field(() => String, { nullable: true })
  breakfastTime?: string | null;

  @Field(() => String, { nullable: true })
  lunchTime?: string | null;

  @Field(() => String, { nullable: true })
  dinnerTime?: string | null;

  @Field(() => Boolean, { nullable: true })
  eatsSnacks?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  frequentlyEatsOutside?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  prefersHomemadeFood?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  followsIntermittentFasting?: boolean | null;

  @Field(() => String, { nullable: true })
  fastingWindow?: string | null;
}

@InputType()
export class UpdateFoodAvailabilityInput {
  @Field(() => [String], { nullable: true })
  availableIngredients?: string[] | null;

  @Field(() => String, { nullable: true })
  otherIngredients?: string | null;
}

@InputType()
export class UpdateWorkoutPreferencesInput {
  @Field(() => String, { nullable: true })
  fitnessLevel?: string | null;

  @Field(() => String, { nullable: true })
  workoutExperience?: string | null;

  @Field(() => String, { nullable: true })
  workoutLocation?: string | null;

  @Field(() => Boolean, { nullable: true })
  gymMembership?: boolean | null;

  @Field(() => [String], { nullable: true })
  availableEquipment?: string[] | null;

  @Field(() => String, { nullable: true })
  otherEquipment?: string | null;

  @Field(() => [String], { nullable: true })
  preferredWorkouts?: string[] | null;

  @Field(() => [String], { nullable: true })
  preferredSports?: string[] | null;
}

@InputType()
export class UpdateWorkoutScheduleInput {
  @Field(() => Int, { nullable: true })
  workoutDaysPerWeek?: number | null;

  @Field(() => String, { nullable: true })
  workoutDuration?: string | null;

  @Field(() => String, { nullable: true })
  preferredWorkoutTime?: string | null;

  @Field(() => [String], { nullable: true })
  restDays?: string[] | null;

  @Field(() => String, { nullable: true })
  preferredIntensity?: string | null;
}

@InputType()
export class UpdateExerciseRestrictionsInput {
  @Field(() => String, { nullable: true })
  currentInjuries?: string | null;

  @Field(() => Boolean, { nullable: true })
  experiencesJointPain?: boolean | null;

  @Field(() => String, { nullable: true })
  restrictedExercises?: string | null;

  @Field(() => String, { nullable: true })
  dislikedExercises?: string | null;

  @Field(() => String, { nullable: true })
  doctorExerciseRestrictions?: string | null;
}

@InputType()
export class UpdateWorkLifeInput {
  @Field(() => String, { nullable: true })
  workType?: string | null;

  @Field(() => String, { nullable: true })
  workStartTime?: string | null;

  @Field(() => String, { nullable: true })
  workEndTime?: string | null;

  @Field(() => [String], { nullable: true })
  workingDays?: string[] | null;

  @Field(() => Float, { nullable: true })
  dailySittingHours?: number | null;

  @Field(() => Float, { nullable: true })
  dailyStandingHours?: number | null;

  @Field(() => Int, { nullable: true })
  dailyCommuteTime?: number | null;

  @Field(() => String, { nullable: true })
  sleepTime?: string | null;

  @Field(() => String, { nullable: true })
  wakeUpTime?: string | null;

  @Field(() => String, { nullable: true })
  stressLevel?: string | null;

  @Field(() => String, { nullable: true })
  freeTime?: string | null;
}

@InputType()
export class UpdatePersonalizationInput {
  @Field(() => Boolean, { nullable: true })
  reminderPreference?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  waterReminder?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  mealReminder?: boolean | null;

  @Field(() => Boolean, { nullable: true })
  workoutReminder?: boolean | null;

  @Field(() => String, { nullable: true })
  preferredLanguage?: string | null;

  @Field(() => String, { nullable: true })
  coachingStyle?: string | null;

  @Field(() => String, { nullable: true })
  notificationFrequency?: string | null;

  @Field(() => Int, { nullable: true })
  dailyWaterTargetMl?: number | null;

  @Field(() => Int, { nullable: true })
  sleepGoalMinutes?: number | null;
}

@InputType()
export default class UpdateMyProfileInput {
  @Field(() => UpdateBasicProfileInput, { nullable: true })
  basic?: UpdateBasicProfileInput | null;

  @Field(() => UpdateFitnessGoalInput, { nullable: true })
  fitnessGoal?: UpdateFitnessGoalInput | null;

  @Field(() => UpdateBodyMeasurementInput, { nullable: true })
  bodyMeasurement?: UpdateBodyMeasurementInput | null;

  @Field(() => UpdateBodyCompositionInput, { nullable: true })
  bodyComposition?: UpdateBodyCompositionInput | null;

  @Field(() => [UpdateMedicalHistoryInput], { nullable: true })
  medicalHistories?: UpdateMedicalHistoryInput[] | null;

  @Field(() => [UpdateMedicationInput], { nullable: true })
  medications?: UpdateMedicationInput[] | null;

  @Field(() => [UpdateAllergyInput], { nullable: true })
  allergies?: UpdateAllergyInput[] | null;

  @Field(() => UpdateFoodPreferencesInput, { nullable: true })
  foodPreferences?: UpdateFoodPreferencesInput | null;

  @Field(() => UpdateEatingHabitsInput, { nullable: true })
  eatingHabits?: UpdateEatingHabitsInput | null;

  @Field(() => UpdateFoodAvailabilityInput, { nullable: true })
  foodAvailability?: UpdateFoodAvailabilityInput | null;

  @Field(() => UpdateWorkoutPreferencesInput, { nullable: true })
  workoutPreferences?: UpdateWorkoutPreferencesInput | null;

  @Field(() => UpdateWorkoutScheduleInput, { nullable: true })
  workoutSchedule?: UpdateWorkoutScheduleInput | null;

  @Field(() => UpdateExerciseRestrictionsInput, { nullable: true })
  exerciseRestrictions?: UpdateExerciseRestrictionsInput | null;

  @Field(() => UpdateWorkLifeInput, { nullable: true })
  workLife?: UpdateWorkLifeInput | null;

  @Field(() => UpdatePersonalizationInput, { nullable: true })
  personalization?: UpdatePersonalizationInput | null;
}
