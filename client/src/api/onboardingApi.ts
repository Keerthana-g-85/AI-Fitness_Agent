import { ClientError } from "graphql-request";
import { graphqlClient } from "./graphqlClient";
import { getAuthToken } from "./auth";
import { COMPLETE_ONBOARDING } from "../graphql/Mutation/COMPLETE_ONBOARDING";
import type {
  BodyCompositionData,
  BodyMeasurementsData,
  OnboardingData,
} from "../types/onboarding";

interface ProfileInput {
  dateOfBirth: string;
  heightCm: number;
  gender: string;
  occupation: string | null;
  country: string;
  activityLevel: string;
}

interface FitnessGoalInput {
  primaryGoal: string;
  secondaryGoal: string | null;
  currentWeightKg: number;
  targetWeightKg: number | null;
  targetBodyFatPercentage: number | null;
  targetMuscleMassKg: number | null;
  targetDate: string | null;
}

interface BodyMeasurementInput {
  weightKg: number | null;
  neckCm: number | null;
  shoulderCm: number | null;
  chestCm: number | null;
  bustCm: number | null;
  waistCm: number | null;
  abdomenCm: number | null;
  hipCm: number | null;
  leftArmCm: number | null;
  rightArmCm: number | null;
  leftThighCm: number | null;
  rightThighCm: number | null;
  leftCalfCm: number | null;
  rightCalfCm: number | null;
  measuredAt: string | null;
  notes: string | null;
}

interface BodyCompositionInput {
  bodyFatPercentage: number | null;
  fatMassKg: number | null;
  muscleMassKg: number | null;
  skeletalMuscleMassKg: number | null;
  leanBodyMassKg: number | null;
  bodyWaterPercentage: number | null;
  totalBodyWaterLiters: number | null;
  visceralFat: number | null;
  boneMassKg: number | null;
  proteinPercentage: number | null;
  bmrKcal: number | null;
  bmi: number | null;
  metabolicAge: number | null;
  source: string | null;
  measuredAt: string | null;
}

interface MedicalHistoryInput {
  id: string;
  conditionName: string;
  description: string | null;
  isActive: boolean;
  doctorAdvice: string | null;
  treatmentDetails: string | null;
  diagnosisDate: string | null;
  notes: string | null;
}

interface MedicationInput {
  id: string;
  medicineName: string;
  dosage: string | null;
  frequency: string | null;
  startDate: string | null;
  endDate: string | null;
  reasonForTaking: string | null;
  doctorPrescribed: boolean;
  notes: string | null;
}

interface AllergyInput {
  id: string;
  allergyName: string;
  allergyType: string | null;
  severity: string | null;
  reaction: string | null;
  notes: string | null;
}

interface CompleteOnboardingInput {
  submissionId: string;
  profile: ProfileInput;
  fitnessGoal: FitnessGoalInput;
  bodyMeasurement: BodyMeasurementInput | null;
  bodyComposition: BodyCompositionInput | null;
  medicalHistories: MedicalHistoryInput[];
  medications: MedicationInput[];
  allergies: AllergyInput[];
  foodPreferences: {
    dietType: string;
    preferredCuisines: string[];
    foodAllergies: string[];
    otherFoodAllergy: string | null;
    foodIntolerances: string[];
    otherFoodIntolerance: string | null;
    dislikedFoods: string[];
    favouriteFoods: string[];
    dailyFoodBudget: number | null;
    cookingPreference: string;
    cookingTime: number | null;
  };
  eatingHabits: {
    mealsPerDay: string;
    breakfastTime: string | null;
    lunchTime: string | null;
    dinnerTime: string | null;
    eatsSnacks: boolean;
    frequentlyEatsOutside: boolean;
    prefersHomemadeFood: boolean;
    followsIntermittentFasting: boolean;
    fastingWindow: string | null;
  };
  foodAvailability: {
    availableIngredients: string[];
    otherIngredients: string | null;
  };
  workoutPreferences: {
    fitnessLevel: string;
    workoutExperience: string;
    workoutLocation: string;
    gymMembership: boolean;
    availableEquipment: string[];
    otherEquipment: string | null;
    preferredWorkouts: string[];
  };
  workoutSchedule: {
    workoutDaysPerWeek: number;
    workoutDuration: string;
    preferredWorkoutTime: string;
    restDays: string[];
    preferredIntensity: string;
  };
  exerciseRestrictions: {
    currentInjuries: string | null;
    experiencesJointPain: boolean;
    restrictedExercises: string | null;
    dislikedExercises: string | null;
    doctorExerciseRestrictions: string | null;
  };
  workLife: {
    workType: string;
    workStartTime: string | null;
    workEndTime: string | null;
    workingDays: string[];
    dailySittingHours: number | null;
    dailyStandingHours: number | null;
    dailyCommuteTime: number | null;
    sleepTime: string;
    wakeUpTime: string;
    stressLevel: string | null;
    freeTime: string;
  };
  personalization: {
    reminderPreference: boolean;
    waterReminder: boolean;
    mealReminder: boolean;
    workoutReminder: boolean;
    preferredLanguage: string;
    coachingStyle: string;
    notificationFrequency: string;
  };
  dataSharingConsent: {
    consentGiven: boolean;
    consentVersion: string;
  };
}

export interface OnboardingResponse {
  success: boolean;
  message: string;
}

interface CompleteOnboardingMutationData {
  completeOnboarding: OnboardingResponse;
}

const textOrNull = (value: string): string | null => {
  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

const numberOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number(value);

const integerOrNull = (value: string): number | null =>
  value.trim() === "" ? null : Number.parseInt(value, 10);

const cleanArray = (values: string[]): string[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const buildBodyMeasurementInput = (
  measurements: BodyMeasurementsData,
): BodyMeasurementInput | null => {
  const input: BodyMeasurementInput = {
    weightKg: numberOrNull(measurements.weight),
    neckCm: numberOrNull(measurements.neck),
    shoulderCm: numberOrNull(measurements.shoulder),
    chestCm: numberOrNull(measurements.chest),
    bustCm: numberOrNull(measurements.bust),
    waistCm: numberOrNull(measurements.waist),
    abdomenCm: numberOrNull(measurements.abdomen),
    hipCm: numberOrNull(measurements.hip),
    leftArmCm: numberOrNull(measurements.leftArm),
    rightArmCm: numberOrNull(measurements.rightArm),
    leftThighCm: numberOrNull(measurements.leftThigh),
    rightThighCm: numberOrNull(measurements.rightThigh),
    leftCalfCm: numberOrNull(measurements.leftCalf),
    rightCalfCm: numberOrNull(measurements.rightCalf),
    measuredAt: measurements.measuredAt,
    notes: textOrNull(measurements.notes),
  };

  return Object.values(input).some((value) => value !== null) ? input : null;
};

const buildBodyCompositionInput = (
  composition: BodyCompositionData,
): BodyCompositionInput | null => {
  const input: BodyCompositionInput = {
    bodyFatPercentage: numberOrNull(composition.bodyFatPercentage),
    fatMassKg: numberOrNull(composition.fatMass),
    muscleMassKg: numberOrNull(composition.muscleMass),
    skeletalMuscleMassKg: numberOrNull(composition.skeletalMuscleMass),
    leanBodyMassKg: numberOrNull(composition.leanBodyMass),
    bodyWaterPercentage: numberOrNull(composition.bodyWaterPercentage),
    totalBodyWaterLiters: numberOrNull(composition.totalBodyWater),
    visceralFat: integerOrNull(composition.visceralFat),
    boneMassKg: numberOrNull(composition.boneMass),
    proteinPercentage: numberOrNull(composition.proteinPercentage),
    bmrKcal: integerOrNull(composition.bmr),
    bmi: numberOrNull(composition.bmi),
    metabolicAge: integerOrNull(composition.metabolicAge),
    source: composition.source || null,
    measuredAt: composition.measuredAt,
  };

  return Object.values(input).some((value) => value !== null) ? input : null;
};

const buildInput = (data: OnboardingData): CompleteOnboardingInput => ({
  submissionId: data.submissionId,
  profile: {
    dateOfBirth: data.profile.dateOfBirth ?? "",
    heightCm: Number(data.profile.height),
    gender: data.profile.gender,
    occupation: textOrNull(data.profile.occupation),
    country: data.profile.country,
    activityLevel: data.profile.activityLevel,
  },
  fitnessGoal: {
    primaryGoal: data.fitnessGoal.primaryGoal,
    secondaryGoal: data.fitnessGoal.secondaryGoal || null,
    currentWeightKg: Number(data.fitnessGoal.currentWeight),
    targetWeightKg: numberOrNull(data.fitnessGoal.targetWeight),
    targetBodyFatPercentage: numberOrNull(
      data.fitnessGoal.targetBodyFatPercentage,
    ),
    targetMuscleMassKg: numberOrNull(data.fitnessGoal.targetMuscleMass),
    targetDate: data.fitnessGoal.targetDate,
  },
  bodyMeasurement: buildBodyMeasurementInput(data.bodyMeasurements),
  bodyComposition: buildBodyCompositionInput(data.bodyComposition),
  medicalHistories: data.medicalHistory.map((condition) => ({
    id: condition.id,
    conditionName: condition.conditionName,
    description: textOrNull(condition.description),
    isActive: condition.active,
    doctorAdvice: textOrNull(condition.doctorAdvice),
    treatmentDetails: textOrNull(condition.treatmentDetails),
    diagnosisDate: condition.diagnosisDate,
    notes: textOrNull(condition.notes),
  })),
  medications: data.medications.map((medication) => ({
    id: medication.id,
    medicineName: medication.medicineName,
    dosage: textOrNull(medication.dosage),
    frequency: medication.frequency || null,
    startDate: medication.startDate,
    endDate: medication.endDate,
    reasonForTaking: textOrNull(medication.reasonForTaking),
    doctorPrescribed: medication.doctorPrescribed,
    notes: textOrNull(medication.notes),
  })),
  allergies: data.allergies.map((allergy) => ({
    id: allergy.id,
    allergyName: allergy.allergyName,
    allergyType: allergy.allergyType || null,
    severity: allergy.severity || null,
    reaction: textOrNull(allergy.reaction),
    notes: textOrNull(allergy.notes),
  })),
  foodPreferences: {
    dietType: data.foodPreferences.dietType,
    preferredCuisines: cleanArray(data.foodPreferences.preferredCuisines),
    foodAllergies: cleanArray(data.foodPreferences.foodAllergies),
    otherFoodAllergy: textOrNull(data.foodPreferences.otherFoodAllergy),
    foodIntolerances: cleanArray(data.foodPreferences.foodIntolerances),
    otherFoodIntolerance: textOrNull(data.foodPreferences.otherFoodIntolerance),
    dislikedFoods: cleanArray(data.foodPreferences.dislikedFoods),
    favouriteFoods: cleanArray(data.foodPreferences.favouriteFoods),
    dailyFoodBudget: numberOrNull(data.foodPreferences.dailyFoodBudget),
    cookingPreference: data.foodPreferences.cookingPreference,
    cookingTime: integerOrNull(data.foodPreferences.cookingTimeAvailable),
  },
  eatingHabits: {
    mealsPerDay: data.eatingHabits.mealsPerDay,
    breakfastTime: data.eatingHabits.breakfastTime,
    lunchTime: data.eatingHabits.lunchTime,
    dinnerTime: data.eatingHabits.dinnerTime,
    eatsSnacks: data.eatingHabits.eatsSnacks,
    frequentlyEatsOutside: data.eatingHabits.frequentlyEatsOutside,
    prefersHomemadeFood: data.eatingHabits.prefersHomemadeFood,
    followsIntermittentFasting: data.eatingHabits.followsIntermittentFasting,
    fastingWindow: data.eatingHabits.fastingWindow || null,
  },
  foodAvailability: {
    availableIngredients: cleanArray(data.foodAvailability.ingredients),
    otherIngredients: textOrNull(data.foodAvailability.otherIngredients),
  },
  workoutPreferences: {
    fitnessLevel: data.workoutExperience.fitnessLevel,
    workoutExperience: data.workoutExperience.workoutExperience,
    workoutLocation: data.workoutExperience.workoutLocation,
    gymMembership: data.workoutExperience.gymMembership,
    availableEquipment: cleanArray(data.workoutExperience.availableEquipment),
    otherEquipment: textOrNull(data.workoutExperience.otherEquipment),
    preferredWorkouts: cleanArray(data.workoutSchedule.workoutPreferences),
  },
  workoutSchedule: {
    workoutDaysPerWeek: Number.parseInt(data.workoutSchedule.workoutDaysPerWeek, 10),
    workoutDuration: data.workoutSchedule.workoutDuration,
    preferredWorkoutTime: data.workoutSchedule.preferredWorkoutTime,
    restDays: cleanArray(data.workoutSchedule.restDays),
    preferredIntensity: data.workoutSchedule.preferredIntensity,
  },
  exerciseRestrictions: {
    currentInjuries: textOrNull(data.exerciseRestrictions.currentInjuries),
    experiencesJointPain: data.exerciseRestrictions.hasJointPain,
    restrictedExercises: textOrNull(data.exerciseRestrictions.exerciseRestrictions),
    dislikedExercises: textOrNull(data.exerciseRestrictions.dislikedExercises),
    doctorExerciseRestrictions: textOrNull(
      data.exerciseRestrictions.doctorExerciseRestrictions,
    ),
  },
  workLife: {
    workType: data.workLife.workType,
    workStartTime: data.workLife.workStartTime,
    workEndTime: data.workLife.workEndTime,
    workingDays: cleanArray(data.workLife.workingDays),
    dailySittingHours: numberOrNull(data.workLife.dailySittingHours),
    dailyStandingHours: numberOrNull(data.workLife.dailyStandingHours),
    dailyCommuteTime: integerOrNull(data.workLife.dailyCommuteMinutes),
    sleepTime: data.workLife.sleepTime ?? "",
    wakeUpTime: data.workLife.wakeUpTime ?? "",
    stressLevel: data.workLife.stressLevel || null,
    freeTime: data.workLife.freeTimeForExercise,
  },
  personalization: {
    reminderPreference: data.personalization.enableReminders,
    waterReminder: data.personalization.waterReminders,
    mealReminder: data.personalization.mealReminders,
    workoutReminder: data.personalization.workoutReminders,
    preferredLanguage: data.personalization.preferredLanguage,
    coachingStyle: data.personalization.coachingStyle,
    notificationFrequency: data.personalization.notificationFrequency,
  },
  dataSharingConsent: {
    consentGiven: data.personalization.dataSharingConsent,
    consentVersion: "1.0",
  },
});

export const completeOnboarding = async (
  data: OnboardingData,
): Promise<OnboardingResponse> => {
  const token = getAuthToken();
  const response = await graphqlClient.request<
    CompleteOnboardingMutationData,
    { input: CompleteOnboardingInput }
  >(
    COMPLETE_ONBOARDING,
    { input: buildInput(data) },
    token ? { authorization: `Bearer ${token}` } : {},
  );

  return response.completeOnboarding;
};

export const getOnboardingErrorMessage = (error: unknown): string => {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to save onboarding information. Please try again.";
};
