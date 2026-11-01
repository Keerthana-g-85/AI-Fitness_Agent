import { Field, Float, ID, InputType, Int } from "type-graphql";

@InputType()
export class ProfileInput {
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

@InputType()
export class FitnessGoalInput {
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

@InputType()
export class BodyCompositionInput {
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
export class MedicalHistoryInput {
  @Field(() => ID, { nullable: true })
  id?: string | null;

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

@InputType()
export class MedicationInput {
  @Field(() => ID, { nullable: true })
  id?: string | null;

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

@InputType()
export class AllergyInput {
  @Field(() => ID, { nullable: true })
  id?: string | null;

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

@InputType()
export class FoodPreferencesInput {
  @Field(() => String)
  dietType!: string;

  @Field(() => [String])
  preferredCuisines!: string[];

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

@InputType()
export class EatingHabitsInput {
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

@InputType()
export class FoodAvailabilityInput {
  @Field(() => [String])
  availableIngredients!: string[];

  @Field(() => String, { nullable: true })
  otherIngredients?: string | null;
}

@InputType()
export class WorkoutPreferencesInput {
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
}

@InputType()
export class WorkoutScheduleInput {
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

@InputType()
export class ExerciseRestrictionsInput {
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

@InputType()
export class WorkLifeInput {
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

@InputType()
export class PersonalizationInput {
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
}

@InputType()
export class DataSharingConsentInput {
  @Field(() => Boolean)
  consentGiven!: boolean;

  @Field(() => String)
  consentVersion!: string;
}

@InputType()
export default class CompleteOnboardingInput {
  @Field(() => ID)
  submissionId!: string;

  @Field(() => ProfileInput)
  profile!: ProfileInput;

  @Field(() => FitnessGoalInput)
  fitnessGoal!: FitnessGoalInput;

  @Field(() => BodyCompositionInput, { nullable: true })
  bodyComposition?: BodyCompositionInput | null;

  @Field(() => [MedicalHistoryInput])
  medicalHistories!: MedicalHistoryInput[];

  @Field(() => [MedicationInput])
  medications!: MedicationInput[];

  @Field(() => [AllergyInput])
  allergies!: AllergyInput[];

  @Field(() => FoodPreferencesInput)
  foodPreferences!: FoodPreferencesInput;

  @Field(() => EatingHabitsInput)
  eatingHabits!: EatingHabitsInput;

  @Field(() => FoodAvailabilityInput)
  foodAvailability!: FoodAvailabilityInput;

  @Field(() => WorkoutPreferencesInput)
  workoutPreferences!: WorkoutPreferencesInput;

  @Field(() => WorkoutScheduleInput)
  workoutSchedule!: WorkoutScheduleInput;

  @Field(() => ExerciseRestrictionsInput)
  exerciseRestrictions!: ExerciseRestrictionsInput;

  @Field(() => WorkLifeInput)
  workLife!: WorkLifeInput;

  @Field(() => PersonalizationInput)
  personalization!: PersonalizationInput;

  @Field(() => DataSharingConsentInput)
  dataSharingConsent!: DataSharingConsentInput;
}
