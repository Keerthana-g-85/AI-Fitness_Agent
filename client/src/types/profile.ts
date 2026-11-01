export interface AuthUser {
  id: string;
  name: string;
  email: string;
  onboardingCompleted: boolean;
  onboardingCompletedAt?: string | null;
}

export interface BasicProfile {
  dateOfBirth: string;
  heightCm: number;
  gender: string;
  occupation?: string | null;
  country: string;
  activityLevel: string;
}

export interface FitnessGoalProfile {
  id: string;
  primaryGoal: string;
  secondaryGoal?: string | null;
  currentWeightKg: number;
  targetWeightKg?: number | null;
  targetBodyFatPercentage?: number | null;
  targetMuscleMassKg?: number | null;
  targetDate?: string | null;
}

export interface BodyMeasurementProfile {
  id: string;
  weightKg?: number | null;
  neckCm?: number | null;
  shoulderCm?: number | null;
  chestCm?: number | null;
  bustCm?: number | null;
  waistCm?: number | null;
  abdomenCm?: number | null;
  hipCm?: number | null;
  leftArmCm?: number | null;
  rightArmCm?: number | null;
  leftThighCm?: number | null;
  rightThighCm?: number | null;
  leftCalfCm?: number | null;
  rightCalfCm?: number | null;
  heightCm?: number | null;
  source?: string | null;
  measuredAt?: string | null;
  notes?: string | null;
  createdAt?: string;
}

export interface BodyCompositionProfile {
  id: string;
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
  measuredAt?: string | null;
}

export interface MedicalHistoryProfile {
  id: string;
  conditionName: string;
  description?: string | null;
  isActive: boolean;
  doctorAdvice?: string | null;
  treatmentDetails?: string | null;
  diagnosisDate?: string | null;
  notes?: string | null;
}

export interface MedicationProfile {
  id: string;
  medicineName: string;
  dosage?: string | null;
  frequency?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  reasonForTaking?: string | null;
  doctorPrescribed: boolean;
  notes?: string | null;
}

export interface AllergyProfile {
  id: string;
  allergyName: string;
  allergyType?: string | null;
  severity?: string | null;
  reaction?: string | null;
  notes?: string | null;
}

export interface FoodPreferenceProfile {
  dietType: string;
  preferredCuisine: string[];
  foodAllergies: string[];
  otherFoodAllergy?: string | null;
  foodIntolerances: string[];
  otherFoodIntolerance?: string | null;
  dislikedFoods: string[];
  favouriteFoods: string[];
  dailyFoodBudget?: number | null;
  cookingPreference: string;
  cookingTime?: number | null;
}

export interface EatingHabitProfile {
  mealsPerDay: string;
  breakfastTime?: string | null;
  lunchTime?: string | null;
  dinnerTime?: string | null;
  eatsSnacks: boolean;
  frequentlyEatsOutside: boolean;
  prefersHomemadeFood: boolean;
  followsIntermittentFasting: boolean;
  fastingWindow?: string | null;
}

export interface FoodAvailabilityProfile {
  availableIngredients: string[];
  otherIngredients?: string | null;
}

export interface WorkoutPreferenceProfile {
  fitnessLevel: string;
  workoutExperience: string;
  workoutLocation: string;
  gymMembership: boolean;
  availableEquipment: string[];
  otherEquipment?: string | null;
  preferredWorkouts: string[];
  preferredSports: string[];
}

export interface WorkoutScheduleProfile {
  workoutDaysPerWeek: number;
  workoutDuration: string;
  preferredWorkoutTime: string;
  restDays: string[];
  preferredIntensity: string;
}

export interface ExerciseRestrictionProfile {
  currentInjuries?: string | null;
  experiencesJointPain: boolean;
  restrictedExercises?: string | null;
  dislikedExercises?: string | null;
  doctorExerciseRestrictions?: string | null;
}

export interface WorkLifeProfile {
  workType: string;
  workStartTime?: string | null;
  workEndTime?: string | null;
  workingDays: string[];
  dailySittingHours?: number | null;
  dailyStandingHours?: number | null;
  dailyCommuteTime?: number | null;
  sleepTime: string;
  wakeUpTime: string;
  stressLevel?: string | null;
  freeTime: string;
}

export interface PersonalizationProfile {
  reminderPreference: boolean;
  waterReminder: boolean;
  mealReminder: boolean;
  workoutReminder: boolean;
  preferredLanguage: string;
  coachingStyle: string;
  notificationFrequency: string;
  dailyWaterTargetMl?: number | null;
  sleepGoalMinutes?: number | null;
}

export interface MyProfile {
  user: AuthUser;
  profile?: BasicProfile | null;
  fitnessGoal?: FitnessGoalProfile | null;
  latestBodyMeasurement?: BodyMeasurementProfile | null;
  latestBodyComposition?: BodyCompositionProfile | null;
  medicalHistories: MedicalHistoryProfile[];
  medications: MedicationProfile[];
  allergies: AllergyProfile[];
  foodPreferences?: FoodPreferenceProfile | null;
  eatingHabits?: EatingHabitProfile | null;
  foodAvailability?: FoodAvailabilityProfile | null;
  workoutPreferences?: WorkoutPreferenceProfile | null;
  workoutSchedule?: WorkoutScheduleProfile | null;
  exerciseRestrictions?: ExerciseRestrictionProfile | null;
  workLife?: WorkLifeProfile | null;
  personalization?: PersonalizationProfile | null;
}

export interface DashboardProfile {
  user: AuthUser;
  profile?: BasicProfile | null;
  fitnessGoal?: FitnessGoalProfile | null;
  latestBodyMeasurement?: Pick<
    BodyMeasurementProfile,
    "id" | "weightKg" | "measuredAt"
  > | null;
  latestBodyComposition?: Pick<
    BodyCompositionProfile,
    "id" | "bodyFatPercentage" | "bmi" | "measuredAt"
  > | null;
}

export interface LoginInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string | null;
  user?: AuthUser | null;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
}

export type EditableSection =
  | "basic"
  | "fitnessGoal"
  | "bodyMeasurement"
  | "bodyComposition"
  | "medicalHistories"
  | "medications"
  | "allergies"
  | "food"
  | "workout"
  | "workLifeAndPersonalization"
  | "preferences";

export interface UpdateMyProfileInput {
  basic?: {
    name?: string | null;
    email?: string | null;
    dateOfBirth?: string | null;
    heightCm?: number | null;
    gender?: string | null;
    occupation?: string | null;
    country?: string | null;
    activityLevel?: string | null;
  };
  fitnessGoal?: {
    primaryGoal?: string | null;
    secondaryGoal?: string | null;
    currentWeightKg?: number | null;
    targetWeightKg?: number | null;
    targetBodyFatPercentage?: number | null;
    targetMuscleMassKg?: number | null;
    targetDate?: string | null;
  };
  bodyMeasurement?: {
    id?: string | null;
    weightKg?: number | null;
    neckCm?: number | null;
    shoulderCm?: number | null;
    chestCm?: number | null;
    bustCm?: number | null;
    waistCm?: number | null;
    abdomenCm?: number | null;
    hipCm?: number | null;
    leftArmCm?: number | null;
    rightArmCm?: number | null;
    leftThighCm?: number | null;
    rightThighCm?: number | null;
    leftCalfCm?: number | null;
    rightCalfCm?: number | null;
    heightCm?: number | null;
    source?: string | null;
    measuredAt?: string | null;
    notes?: string | null;
  };
  bodyComposition?: {
    id?: string | null;
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
    measuredAt?: string | null;
  };
  medicalHistories?: Array<{
    id?: string | null;
    conditionName?: string | null;
    description?: string | null;
    isActive?: boolean | null;
    doctorAdvice?: string | null;
    treatmentDetails?: string | null;
    diagnosisDate?: string | null;
    notes?: string | null;
  }>;
  medications?: Array<{
    id?: string | null;
    medicineName?: string | null;
    dosage?: string | null;
    frequency?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    reasonForTaking?: string | null;
    doctorPrescribed?: boolean | null;
    notes?: string | null;
  }>;
  allergies?: Array<{
    id?: string | null;
    allergyName?: string | null;
    allergyType?: string | null;
    severity?: string | null;
    reaction?: string | null;
    notes?: string | null;
  }>;
  foodPreferences?: {
    dietType?: string | null;
    preferredCuisine?: string[] | null;
    foodAllergies?: string[] | null;
    otherFoodAllergy?: string | null;
    foodIntolerances?: string[] | null;
    otherFoodIntolerance?: string | null;
    dislikedFoods?: string[] | null;
    favouriteFoods?: string[] | null;
    dailyFoodBudget?: number | null;
    cookingPreference?: string | null;
    cookingTime?: number | null;
  };
  eatingHabits?: {
    mealsPerDay?: string | null;
    breakfastTime?: string | null;
    lunchTime?: string | null;
    dinnerTime?: string | null;
    eatsSnacks?: boolean | null;
    frequentlyEatsOutside?: boolean | null;
    prefersHomemadeFood?: boolean | null;
    followsIntermittentFasting?: boolean | null;
    fastingWindow?: string | null;
  };
  foodAvailability?: {
    availableIngredients?: string[] | null;
    otherIngredients?: string | null;
  };
  workoutPreferences?: {
    fitnessLevel?: string | null;
    workoutExperience?: string | null;
    workoutLocation?: string | null;
    gymMembership?: boolean | null;
    availableEquipment?: string[] | null;
    otherEquipment?: string | null;
    preferredWorkouts?: string[] | null;
    preferredSports?: string[] | null;
  };
  workoutSchedule?: {
    workoutDaysPerWeek?: number | null;
    workoutDuration?: string | null;
    preferredWorkoutTime?: string | null;
    restDays?: string[] | null;
    preferredIntensity?: string | null;
  };
  exerciseRestrictions?: {
    currentInjuries?: string | null;
    experiencesJointPain?: boolean | null;
    restrictedExercises?: string | null;
    dislikedExercises?: string | null;
    doctorExerciseRestrictions?: string | null;
  };
  workLife?: {
    workType?: string | null;
    workStartTime?: string | null;
    workEndTime?: string | null;
    workingDays?: string[] | null;
    dailySittingHours?: number | null;
    dailyStandingHours?: number | null;
    dailyCommuteTime?: number | null;
    sleepTime?: string | null;
    wakeUpTime?: string | null;
    stressLevel?: string | null;
    freeTime?: string | null;
  };
  personalization?: {
    reminderPreference?: boolean | null;
    waterReminder?: boolean | null;
    mealReminder?: boolean | null;
    workoutReminder?: boolean | null;
    preferredLanguage?: string | null;
    coachingStyle?: string | null;
    notificationFrequency?: string | null;
    dailyWaterTargetMl?: number | null;
    sleepGoalMinutes?: number | null;
  };
}
