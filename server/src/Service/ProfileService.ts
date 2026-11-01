import { In } from "typeorm";
import type { EntityManager } from "typeorm";
import UpdateMyProfileInput, {
  UpdateAllergyInput,
  UpdateBodyCompositionInput,
  UpdateBodyMeasurementInput,
  UpdateEatingHabitsInput,
  UpdateExerciseRestrictionsInput,
  UpdateFitnessGoalInput,
  UpdateFoodAvailabilityInput,
  UpdateFoodPreferencesInput,
  UpdateMedicalHistoryInput,
  UpdateMedicationInput,
  UpdatePersonalizationInput,
  UpdateWorkLifeInput,
  UpdateWorkoutPreferencesInput,
  UpdateWorkoutScheduleInput,
} from "../Arguments/ProfileArguments/UpdateMyProfile";
import Allergy from "../Model/Allergy";
import BodyComposition from "../Model/BodyComposition";
import BodyMeasurement from "../Model/BodyMeasurement";
import EatingHabit from "../Model/EatingHabit";
import ExerciseRestriction from "../Model/ExerciseRestriction";
import FitnessGoal from "../Model/FitnessGoal";
import FoodAvailability from "../Model/FoodAvailability";
import FoodPreference from "../Model/FoodPreference";
import MedicalHistory from "../Model/MedicalHistory";
import Medication from "../Model/Medication";
import Personalization from "../Model/Personalization";
import User from "../Model/User";
import UserProfile from "../Model/UserProfile";
import WorkLife from "../Model/WorkLife";
import WorkoutPreference from "../Model/WorkoutPreference";
import WorkoutSchedule from "../Model/WorkoutSchedule";
import type {
  AllergyResponse,
  BodyCompositionResponse,
  BodyMeasurementResponse,
  BasicProfileResponse,
  DashboardResponse,
  EatingHabitResponse,
  ExerciseRestrictionResponse,
  FitnessGoalResponse,
  FoodAvailabilityResponse,
  FoodPreferenceResponse,
  MedicalHistoryResponse,
  MedicationResponse,
  PersonalizationResponse,
  WorkLifeResponse,
  WorkoutPreferenceResponse,
  WorkoutScheduleResponse,
} from "../Response/ProfileResponse";
import type ProfileResponse from "../Response/ProfileResponse";
import { UpdateProfileResponse } from "../Response/ProfileResponse";
import { AuthUserResponse } from "../Response/LoginResponse";
import { database } from "../database";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

class ProfileValidationError extends Error {}

const trimToNull = (value?: string | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
};

const mergeText = (
  incoming: string | null | undefined,
  existing: string | null | undefined,
): string | null => (incoming === undefined ? existing ?? null : trimToNull(incoming));

const mergeRequiredText = (
  incoming: string | null | undefined,
  existing: string | null | undefined,
): string => mergeText(incoming, existing) ?? "";

const mergeNumber = (
  incoming: number | null | undefined,
  existing: string | number | null | undefined,
): number | null => {
  if (incoming !== undefined) {
    return incoming;
  }

  return toNumber(existing);
};

const mergeBoolean = (
  incoming: boolean | null | undefined,
  existing: boolean | null | undefined,
): boolean => (incoming === undefined ? existing ?? false : incoming ?? false);

const mergeTextArray = (
  incoming: string[] | null | undefined,
  existing: string[] | null | undefined,
): string[] =>
  normalizeTextArray(incoming === undefined ? existing ?? [] : incoming ?? []);

const normalizeTextArray = (values: string[]): string[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const toNumber = (value: string | number | null | undefined): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const toInteger = (value: string | number | null | undefined): number | null => {
  const parsed = toNumber(value);

  return parsed === null ? null : Math.trunc(parsed);
};

const decimal = (value: number | null | undefined): string | null =>
  value === null || value === undefined ? null : String(value);

const isValidDate = (value: string): boolean => {
  if (!DATE_REGEX.test(value)) {
    return false;
  }

  const parts = value.split("-").map(Number);
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];

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

const isNotFutureDate = (value: string): boolean =>
  isValidDate(value) && value <= todayString();

const isFutureDate = (value: string): boolean =>
  isValidDate(value) && value > todayString();

const calculateAge = (dateOfBirth: string): number | null => {
  if (!isValidDate(dateOfBirth)) {
    return null;
  }

  const parts = dateOfBirth.split("-").map(Number);
  const birthYear = parts[0];
  const birthMonth = parts[1];
  const birthDay = parts[2];

  if (birthYear === undefined || birthMonth === undefined || birthDay === undefined) {
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthYear;
  const monthDifference = today.getMonth() + 1 - birthMonth;

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDay)) {
    age -= 1;
  }

  return age;
};

const ensureLength = (
  value: string | null,
  maxLength: number,
  label: string,
): void => {
  if (value && value.length > maxLength) {
    throw new ProfileValidationError(
      `${label} must be ${maxLength} characters or fewer`,
    );
  }
};

const ensureRequired = (value: string | null, label: string): string => {
  if (!value) {
    throw new ProfileValidationError(`${label} is required`);
  }

  return value;
};

const ensurePositive = (
  value: number | null,
  label: string,
): number => {
  if (value === null || !Number.isFinite(value) || value <= 0) {
    throw new ProfileValidationError(`${label} must be greater than 0`);
  }

  return value;
};

const ensurePercentage = (
  value: number | null,
  label: string,
): number | null => {
  if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) {
    throw new ProfileValidationError(`${label} must be between 0 and 100`);
  }

  return value;
};

const ensureTime = (value: string | null, label: string): void => {
  if (value !== null && !TIME_REGEX.test(value)) {
    throw new ProfileValidationError(`Enter a valid ${label.toLowerCase()}`);
  }
};

const compareLatestDate = (
  a: { measuredAt?: string | null; createdAt: Date },
  b: { measuredAt?: string | null; createdAt: Date },
): number => {
  const aDate = a.measuredAt ?? a.createdAt.toISOString().slice(0, 10);
  const bDate = b.measuredAt ?? b.createdAt.toISOString().slice(0, 10);

  return bDate.localeCompare(aDate) || b.createdAt.getTime() - a.createdAt.getTime();
};

const toAuthUser = (user: User): AuthUserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  onboardingCompleted: user.onboardingCompleted,
  onboardingCompletedAt: user.onboardingCompletedAt ?? null,
});

const toBasicProfile = (profile: UserProfile): BasicProfileResponse => ({
  dateOfBirth: profile.dateOfBirth,
  heightCm: toNumber(profile.heightCm) ?? 0,
  gender: profile.gender,
  occupation: profile.occupation ?? null,
  country: profile.country,
  activityLevel: profile.activityLevel,
});

const toFitnessGoal = (goal: FitnessGoal): FitnessGoalResponse => ({
  id: goal.id,
  primaryGoal: goal.primaryGoal,
  secondaryGoal: goal.secondaryGoal ?? null,
  currentWeightKg: toNumber(goal.currentWeightKg) ?? 0,
  targetWeightKg: toNumber(goal.targetWeightKg),
  targetBodyFatPercentage: toNumber(goal.targetBodyFatPercentage),
  targetMuscleMassKg: toNumber(goal.targetMuscleMassKg),
  targetDate: goal.targetDate ?? null,
});

const toBodyMeasurement = (measurement: BodyMeasurement): BodyMeasurementResponse => ({
  id: measurement.id,
  weightKg: toNumber(measurement.weightKg),
  neckCm: toNumber(measurement.neckCm),
  shoulderCm: toNumber(measurement.shoulderCm),
  chestCm: toNumber(measurement.chestCm),
  bustCm: toNumber(measurement.bustCm),
  waistCm: toNumber(measurement.waistCm),
  abdomenCm: toNumber(measurement.abdomenCm),
  hipCm: toNumber(measurement.hipCm),
  leftArmCm: toNumber(measurement.leftArmCm),
  rightArmCm: toNumber(measurement.rightArmCm),
  leftThighCm: toNumber(measurement.leftThighCm),
  rightThighCm: toNumber(measurement.rightThighCm),
  leftCalfCm: toNumber(measurement.leftCalfCm),
  rightCalfCm: toNumber(measurement.rightCalfCm),
  heightCm: toNumber(measurement.heightCm),
  source: measurement.source ?? null,
  measuredAt: measurement.measuredAt ?? null,
  notes: measurement.notes ?? null,
  createdAt: measurement.createdAt,
});

const toBodyComposition = (
  composition: BodyComposition,
): BodyCompositionResponse => ({
  id: composition.id,
  bodyFatPercentage: toNumber(composition.bodyFatPercentage),
  fatMassKg: toNumber(composition.fatMassKg),
  muscleMassKg: toNumber(composition.muscleMassKg),
  skeletalMuscleMassKg: toNumber(composition.skeletalMuscleMassKg),
  leanBodyMassKg: toNumber(composition.leanBodyMassKg),
  bodyWaterPercentage: toNumber(composition.bodyWaterPercentage),
  totalBodyWaterLiters: toNumber(composition.totalBodyWaterLiters),
  visceralFat: toInteger(composition.visceralFat),
  boneMassKg: toNumber(composition.boneMassKg),
  proteinPercentage: toNumber(composition.proteinPercentage),
  bmrKcal: toInteger(composition.bmrKcal),
  bmi: toNumber(composition.bmi),
  metabolicAge: toInteger(composition.metabolicAge),
  source: composition.source ?? null,
  measuredAt: composition.measuredAt ?? null,
});

const toMedicalHistory = (history: MedicalHistory): MedicalHistoryResponse => ({
  id: history.id,
  conditionName: history.conditionName,
  description: history.description ?? null,
  isActive: history.isActive,
  doctorAdvice: history.doctorAdvice ?? null,
  treatmentDetails: history.treatmentDetails ?? null,
  diagnosisDate: history.diagnosisDate ?? null,
  notes: history.notes ?? null,
});

const toMedication = (medication: Medication): MedicationResponse => ({
  id: medication.id,
  medicineName: medication.medicineName,
  dosage: medication.dosage ?? null,
  frequency: medication.frequency ?? null,
  startDate: medication.startDate ?? null,
  endDate: medication.endDate ?? null,
  reasonForTaking: medication.reasonForTaking ?? null,
  doctorPrescribed: medication.doctorPrescribed,
  notes: medication.notes ?? null,
});

const toAllergy = (allergy: Allergy): AllergyResponse => ({
  id: allergy.id,
  allergyName: allergy.allergyName,
  allergyType: allergy.allergyType ?? null,
  severity: allergy.severity ?? null,
  reaction: allergy.reaction ?? null,
  notes: allergy.notes ?? null,
});

const toFoodPreferences = (food: FoodPreference): FoodPreferenceResponse => ({
  dietType: food.dietType,
  preferredCuisine: food.preferredCuisine ?? [],
  foodAllergies: food.foodAllergies ?? [],
  otherFoodAllergy: food.otherFoodAllergy ?? null,
  foodIntolerances: food.foodIntolerances ?? [],
  otherFoodIntolerance: food.otherFoodIntolerance ?? null,
  dislikedFoods: food.dislikedFoods ?? [],
  favouriteFoods: food.favouriteFoods ?? [],
  dailyFoodBudget: toNumber(food.dailyFoodBudget),
  cookingPreference: food.cookingPreference,
  cookingTime: toInteger(food.cookingTime),
});

const toEatingHabits = (habits: EatingHabit): EatingHabitResponse => ({
  mealsPerDay: habits.mealsPerDay,
  breakfastTime: habits.breakfastTime ?? null,
  lunchTime: habits.lunchTime ?? null,
  dinnerTime: habits.dinnerTime ?? null,
  eatsSnacks: habits.eatsSnacks,
  frequentlyEatsOutside: habits.frequentlyEatsOutside,
  prefersHomemadeFood: habits.prefersHomemadeFood,
  followsIntermittentFasting: habits.followsIntermittentFasting,
  fastingWindow: habits.fastingWindow ?? null,
});

const toFoodAvailability = (
  availability: FoodAvailability,
): FoodAvailabilityResponse => ({
  availableIngredients: availability.availableIngredients ?? [],
  otherIngredients: availability.otherIngredients ?? null,
});

const toWorkoutPreferences = (
  workout: WorkoutPreference,
): WorkoutPreferenceResponse => ({
  fitnessLevel: workout.fitnessLevel,
  workoutExperience: workout.workoutExperience,
  workoutLocation: workout.workoutLocation,
  gymMembership: workout.gymMembership,
  availableEquipment: workout.availableEquipment ?? [],
  otherEquipment: workout.otherEquipment ?? null,
  preferredWorkouts: workout.preferredWorkouts ?? [],
  preferredSports: workout.preferredSports ?? [],
});

const toWorkoutSchedule = (
  schedule: WorkoutSchedule,
): WorkoutScheduleResponse => ({
  workoutDaysPerWeek: schedule.workoutDaysPerWeek,
  workoutDuration: schedule.workoutDuration,
  preferredWorkoutTime: schedule.preferredWorkoutTime,
  restDays: schedule.restDays ?? [],
  preferredIntensity: schedule.preferredIntensity,
});

const toExerciseRestrictions = (
  restrictions: ExerciseRestriction,
): ExerciseRestrictionResponse => ({
  currentInjuries: restrictions.currentInjuries ?? null,
  experiencesJointPain: restrictions.experiencesJointPain,
  restrictedExercises: restrictions.restrictedExercises ?? null,
  dislikedExercises: restrictions.dislikedExercises ?? null,
  doctorExerciseRestrictions: restrictions.doctorExerciseRestrictions ?? null,
});

const toWorkLife = (workLife: WorkLife): WorkLifeResponse => ({
  workType: workLife.workType,
  workStartTime: workLife.workStartTime ?? null,
  workEndTime: workLife.workEndTime ?? null,
  workingDays: workLife.workingDays ?? [],
  dailySittingHours: toNumber(workLife.dailySittingHours),
  dailyStandingHours: toNumber(workLife.dailyStandingHours),
  dailyCommuteTime: toInteger(workLife.dailyCommuteTime),
  sleepTime: workLife.sleepTime,
  wakeUpTime: workLife.wakeUpTime,
  stressLevel: workLife.stressLevel ?? null,
  freeTime: workLife.freeTime,
});

const toPersonalization = (
  personalization: Personalization,
): PersonalizationResponse => ({
  reminderPreference: personalization.reminderPreference,
  waterReminder: personalization.waterReminder,
  mealReminder: personalization.mealReminder,
  workoutReminder: personalization.workoutReminder,
  preferredLanguage: personalization.preferredLanguage,
  coachingStyle: personalization.coachingStyle,
  notificationFrequency: personalization.notificationFrequency,
  dailyWaterTargetMl: personalization.dailyWaterTargetMl ?? null,
  sleepGoalMinutes: personalization.sleepGoalMinutes ?? null,
});

export default class ProfileService {
  async getMyProfile(authenticatedUserId: string | null | undefined): Promise<ProfileResponse | null> {
    if (!authenticatedUserId || !UUID_REGEX.test(authenticatedUserId)) {
      return null;
    }

    return this.loadProfile(authenticatedUserId);
  }

  async getDashboard(
    authenticatedUserId: string | null | undefined,
  ): Promise<DashboardResponse | null> {
    const profile = await this.getMyProfile(authenticatedUserId);

    if (!profile) {
      return null;
    }

    return {
      user: profile.user,
      profile: profile.profile ?? null,
      fitnessGoal: profile.fitnessGoal ?? null,
      latestBodyMeasurement: profile.latestBodyMeasurement ?? null,
      latestBodyComposition: profile.latestBodyComposition ?? null,
    };
  }

  async updateMyProfile(
    authenticatedUserId: string | null | undefined,
    input: UpdateMyProfileInput,
  ): Promise<UpdateProfileResponse> {
    if (!authenticatedUserId || !UUID_REGEX.test(authenticatedUserId)) {
      return { success: false, message: "Authentication required" };
    }

    try {
      await database.transaction(async (manager) => {
        const user = await manager
          .getRepository(User)
          .createQueryBuilder("user")
          .setLock("pessimistic_write")
          .where("user.id = :userId", { userId: authenticatedUserId })
          .getOne();

        if (!user) {
          throw new ProfileValidationError("User not found");
        }

        if (input.basic) {
          await this.updateBasic(manager, user, input.basic);
        }

        if (input.fitnessGoal) {
          await this.updateFitnessGoal(manager, user.id, input.fitnessGoal);
        }

        if (input.bodyMeasurement) {
          await this.updateBodyMeasurement(manager, user.id, input.bodyMeasurement);
        }

        if (input.bodyComposition) {
          await this.updateBodyComposition(manager, user.id, input.bodyComposition);
        }

        if (input.medicalHistories) {
          await this.syncMedicalHistories(manager, user.id, input.medicalHistories);
        }

        if (input.medications) {
          await this.syncMedications(manager, user.id, input.medications);
        }

        if (input.allergies) {
          await this.syncAllergies(manager, user.id, input.allergies);
        }

        if (input.foodPreferences) {
          await this.updateFoodPreferences(manager, user.id, input.foodPreferences);
        }

        if (input.eatingHabits) {
          await this.updateEatingHabits(manager, user.id, input.eatingHabits);
        }

        if (input.foodAvailability) {
          await this.updateFoodAvailability(manager, user.id, input.foodAvailability);
        }

        if (input.workoutPreferences) {
          await this.updateWorkoutPreferences(manager, user.id, input.workoutPreferences);
        }

        if (input.workoutSchedule) {
          await this.updateWorkoutSchedule(manager, user.id, input.workoutSchedule);
        }

        if (input.exerciseRestrictions) {
          await this.updateExerciseRestrictions(manager, user.id, input.exerciseRestrictions);
        }

        if (input.workLife) {
          await this.updateWorkLife(manager, user.id, input.workLife);
        }

        if (input.personalization) {
          await this.updatePersonalization(manager, user.id, input.personalization);
        }
      });

      return { success: true, message: "Profile updated successfully" };
    } catch (error) {
      if (error instanceof ProfileValidationError) {
        return { success: false, message: error.message };
      }

      console.error("Profile update failed:", error);

      return {
        success: false,
        message: "Unable to update your profile. Please try again.",
      };
    }
  }

  private async loadProfile(userId: string): Promise<ProfileResponse | null> {
    const user = await database.getRepository(User).findOne({
      where: { id: userId },
      relations: {
        profile: true,
        fitnessGoals: true,
        bodyMeasurements: true,
        bodyCompositions: true,
        medicalHistories: true,
        medications: true,
        allergies: true,
        foodPreferences: true,
        eatingHabits: true,
        foodAvailability: true,
        workoutPreferences: true,
        workoutSchedule: true,
        exerciseRestrictions: true,
        workLife: true,
        personalization: true,
      },
    });

    if (!user) {
      return null;
    }

    const latestGoal = [...(user.fitnessGoals ?? [])].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )[0];
    const latestMeasurement = [...(user.bodyMeasurements ?? [])].sort(
      compareLatestDate,
    )[0];
    const latestComposition = [...(user.bodyCompositions ?? [])].sort(
      compareLatestDate,
    )[0];

    return {
      user: toAuthUser(user),
      profile: user.profile ? toBasicProfile(user.profile) : null,
      fitnessGoal: latestGoal ? toFitnessGoal(latestGoal) : null,
      latestBodyMeasurement: latestMeasurement
        ? toBodyMeasurement(latestMeasurement)
        : null,
      latestBodyComposition: latestComposition
        ? toBodyComposition(latestComposition)
        : null,
      medicalHistories: [...(user.medicalHistories ?? [])]
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(toMedicalHistory),
      medications: [...(user.medications ?? [])]
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(toMedication),
      allergies: [...(user.allergies ?? [])]
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
        .map(toAllergy),
      foodPreferences: user.foodPreferences
        ? toFoodPreferences(user.foodPreferences)
        : null,
      eatingHabits: user.eatingHabits ? toEatingHabits(user.eatingHabits) : null,
      foodAvailability: user.foodAvailability
        ? toFoodAvailability(user.foodAvailability)
        : null,
      workoutPreferences: user.workoutPreferences
        ? toWorkoutPreferences(user.workoutPreferences)
        : null,
      workoutSchedule: user.workoutSchedule
        ? toWorkoutSchedule(user.workoutSchedule)
        : null,
      exerciseRestrictions: user.exerciseRestrictions
        ? toExerciseRestrictions(user.exerciseRestrictions)
        : null,
      workLife: user.workLife ? toWorkLife(user.workLife) : null,
      personalization: user.personalization
        ? toPersonalization(user.personalization)
        : null,
    };
  }

  private async updateBasic(
    manager: EntityManager,
    user: User,
    input: NonNullable<UpdateMyProfileInput["basic"]>,
  ): Promise<void> {
    const repository = manager.getRepository(UserProfile);
    const existing = await repository.findOne({ where: { userId: user.id } });

    const name = mergeText(input.name, user.name) ?? "";
    const email = (mergeText(input.email, user.email) ?? "").toLowerCase();
    const dateOfBirth = mergeRequiredText(input.dateOfBirth, existing?.dateOfBirth);
    const heightCm = mergeNumber(input.heightCm, existing?.heightCm);
    const gender = mergeRequiredText(input.gender, existing?.gender);
    const occupation = mergeText(input.occupation, existing?.occupation);
    const country = mergeRequiredText(input.country, existing?.country);
    const activityLevel = mergeRequiredText(
      input.activityLevel,
      existing?.activityLevel,
    );

    ensureRequired(name, "Name");
    ensureLength(name, 100, "Name");
    ensureRequired(email, "Email");

    if (!EMAIL_REGEX.test(email)) {
      throw new ProfileValidationError("Enter a valid email address");
    }

    if (email !== user.email) {
      const existingUser = await manager.getRepository(User).findOne({
        where: { email },
      });

      if (existingUser && existingUser.id !== user.id) {
        throw new ProfileValidationError("Email already registered");
      }
    }

    if (
      !dateOfBirth ||
      !isValidDate(dateOfBirth) ||
      !isNotFutureDate(dateOfBirth) ||
      (calculateAge(dateOfBirth) ?? 121) > 120
    ) {
      throw new ProfileValidationError("Enter a valid date of birth");
    }

    ensurePositive(heightCm, "Height");
    ensureRequired(gender, "Gender");
    ensureLength(gender, 30, "Gender");
    ensureRequired(country, "Country");
    ensureLength(country, 120, "Country");
    ensureRequired(activityLevel, "Activity level");
    ensureLength(activityLevel, 50, "Activity level");
    ensureLength(occupation, 150, "Occupation");

    user.name = name;
    user.email = email;
    await manager.getRepository(User).save(user);

    const values = {
      userId: user.id,
      dateOfBirth,
      heightCm: decimal(heightCm) ?? "",
      gender,
      occupation,
      country,
      activityLevel,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateFitnessGoal(
    manager: EntityManager,
    userId: string,
    input: UpdateFitnessGoalInput,
  ): Promise<void> {
    const repository = manager.getRepository(FitnessGoal);
    const existing = await repository.findOne({
      where: { userId },
      order: { createdAt: "DESC" },
    });

    const primaryGoal = mergeRequiredText(input.primaryGoal, existing?.primaryGoal);
    const secondaryGoal = mergeText(input.secondaryGoal, existing?.secondaryGoal);
    const currentWeightKg = mergeNumber(
      input.currentWeightKg,
      existing?.currentWeightKg,
    );
    const targetWeightKg = mergeNumber(
      input.targetWeightKg,
      existing?.targetWeightKg,
    );
    const targetBodyFatPercentage = mergeNumber(
      input.targetBodyFatPercentage,
      existing?.targetBodyFatPercentage,
    );
    const targetMuscleMassKg = mergeNumber(
      input.targetMuscleMassKg,
      existing?.targetMuscleMassKg,
    );
    const targetDate = mergeText(input.targetDate, existing?.targetDate);

    ensureRequired(primaryGoal, "Primary goal");
    ensureLength(primaryGoal, 80, "Primary goal");

    if (secondaryGoal) {
      ensureLength(secondaryGoal, 80, "Secondary goal");

      if (secondaryGoal === primaryGoal) {
        throw new ProfileValidationError(
          "Secondary goal must be different from the primary goal",
        );
      }
    }

    ensurePositive(currentWeightKg, "Current weight");

    if (targetWeightKg !== null) {
      ensurePositive(targetWeightKg, "Target weight");
    }

    ensurePercentage(targetBodyFatPercentage, "Target body fat percentage");

    if (targetMuscleMassKg !== null) {
      ensurePositive(targetMuscleMassKg, "Target muscle mass");
    }

    if (targetDate && !isFutureDate(targetDate)) {
      throw new ProfileValidationError("Target date must be in the future");
    }

    const values = {
      userId,
      primaryGoal,
      secondaryGoal,
      currentWeightKg: decimal(currentWeightKg) ?? "",
      targetWeightKg: decimal(targetWeightKg),
      targetBodyFatPercentage: decimal(targetBodyFatPercentage),
      targetMuscleMassKg: decimal(targetMuscleMassKg),
      targetDate,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateBodyMeasurement(
    manager: EntityManager,
    userId: string,
    input: UpdateBodyMeasurementInput,
  ): Promise<void> {
    const repository = manager.getRepository(BodyMeasurement);
    let existing: BodyMeasurement | null = null;

    if (input.id) {
      if (!UUID_REGEX.test(input.id)) {
        throw new ProfileValidationError("Invalid body measurement");
      }

      existing = await repository.findOne({
        where: { id: input.id, userId },
      });

      if (!existing) {
        throw new ProfileValidationError("Body measurement not found");
      }
    }

    const values = {
      weightKg: decimal(mergeNumber(input.weightKg, existing?.weightKg)),
      neckCm: decimal(mergeNumber(input.neckCm, existing?.neckCm)),
      shoulderCm: decimal(mergeNumber(input.shoulderCm, existing?.shoulderCm)),
      chestCm: decimal(mergeNumber(input.chestCm, existing?.chestCm)),
      bustCm: decimal(mergeNumber(input.bustCm, existing?.bustCm)),
      waistCm: decimal(mergeNumber(input.waistCm, existing?.waistCm)),
      abdomenCm: decimal(mergeNumber(input.abdomenCm, existing?.abdomenCm)),
      hipCm: decimal(mergeNumber(input.hipCm, existing?.hipCm)),
      leftArmCm: decimal(mergeNumber(input.leftArmCm, existing?.leftArmCm)),
      rightArmCm: decimal(mergeNumber(input.rightArmCm, existing?.rightArmCm)),
      leftThighCm: decimal(mergeNumber(input.leftThighCm, existing?.leftThighCm)),
      rightThighCm: decimal(mergeNumber(input.rightThighCm, existing?.rightThighCm)),
      leftCalfCm: decimal(mergeNumber(input.leftCalfCm, existing?.leftCalfCm)),
      rightCalfCm: decimal(mergeNumber(input.rightCalfCm, existing?.rightCalfCm)),
      heightCm: decimal(mergeNumber(input.heightCm, existing?.heightCm)),
      source: mergeText(input.source, existing?.source),
      measuredAt: mergeText(input.measuredAt, existing?.measuredAt),
      notes: mergeText(input.notes, existing?.notes),
    };

    const numericValues = [
      values.weightKg,
      values.neckCm,
      values.shoulderCm,
      values.chestCm,
      values.bustCm,
      values.waistCm,
      values.abdomenCm,
      values.hipCm,
      values.leftArmCm,
      values.rightArmCm,
      values.leftThighCm,
      values.rightThighCm,
      values.leftCalfCm,
      values.rightCalfCm,
      values.heightCm,
    ];

    for (const value of numericValues) {
      if (value !== null && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
        throw new ProfileValidationError(
          "Body measurements must be positive numbers",
        );
      }
    }

    if (values.measuredAt && !isNotFutureDate(values.measuredAt)) {
      throw new ProfileValidationError(
        "Measurement date cannot be in the future",
      );
    }

    if (values.source && values.source.length > 80) {
      throw new ProfileValidationError("Source must be 80 characters or fewer");
    }

    if (
      !existing &&
      numericValues.every((value) => value === null) &&
      !values.measuredAt &&
      !values.notes
    ) {
      throw new ProfileValidationError(
        "Enter at least one body measurement value",
      );
    }

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create({ userId, ...values }));
  }

  private async updateBodyComposition(
    manager: EntityManager,
    userId: string,
    input: UpdateBodyCompositionInput,
  ): Promise<void> {
    const repository = manager.getRepository(BodyComposition);
    let existing: BodyComposition | null = null;

    if (input.id) {
      if (!UUID_REGEX.test(input.id)) {
        throw new ProfileValidationError("Invalid body composition");
      }

      existing = await repository.findOne({
        where: { id: input.id, userId },
      });

      if (!existing) {
        throw new ProfileValidationError("Body composition not found");
      }
    }

    const bodyFatPercentage = mergeNumber(
      input.bodyFatPercentage,
      existing?.bodyFatPercentage,
    );
    const bodyWaterPercentage = mergeNumber(
      input.bodyWaterPercentage,
      existing?.bodyWaterPercentage,
    );
    const proteinPercentage = mergeNumber(
      input.proteinPercentage,
      existing?.proteinPercentage,
    );
    const values = {
      bodyFatPercentage: decimal(bodyFatPercentage),
      fatMassKg: decimal(mergeNumber(input.fatMassKg, existing?.fatMassKg)),
      muscleMassKg: decimal(mergeNumber(input.muscleMassKg, existing?.muscleMassKg)),
      skeletalMuscleMassKg: decimal(
        mergeNumber(input.skeletalMuscleMassKg, existing?.skeletalMuscleMassKg),
      ),
      leanBodyMassKg: decimal(
        mergeNumber(input.leanBodyMassKg, existing?.leanBodyMassKg),
      ),
      bodyWaterPercentage: decimal(bodyWaterPercentage),
      totalBodyWaterLiters: decimal(
        mergeNumber(input.totalBodyWaterLiters, existing?.totalBodyWaterLiters),
      ),
      visceralFat: mergeNumber(input.visceralFat, existing?.visceralFat),
      boneMassKg: decimal(mergeNumber(input.boneMassKg, existing?.boneMassKg)),
      proteinPercentage: decimal(proteinPercentage),
      bmrKcal: mergeNumber(input.bmrKcal, existing?.bmrKcal),
      bmi: decimal(mergeNumber(input.bmi, existing?.bmi)),
      metabolicAge: mergeNumber(input.metabolicAge, existing?.metabolicAge),
      source: mergeText(input.source, existing?.source),
      measuredAt: mergeText(input.measuredAt, existing?.measuredAt),
    };

    ensurePercentage(bodyFatPercentage, "Body fat percentage");
    ensurePercentage(bodyWaterPercentage, "Body water percentage");
    ensurePercentage(proteinPercentage, "Protein percentage");

    const positiveValues = [
      values.fatMassKg,
      values.muscleMassKg,
      values.skeletalMuscleMassKg,
      values.leanBodyMassKg,
      values.totalBodyWaterLiters,
      values.boneMassKg,
      values.bmi,
    ];

    for (const value of positiveValues) {
      if (value !== null && (!Number.isFinite(Number(value)) || Number(value) <= 0)) {
        throw new ProfileValidationError("Body composition values are invalid");
      }
    }

    for (const value of [values.visceralFat, values.bmrKcal, values.metabolicAge]) {
      if (value !== null && (!Number.isInteger(value) || value < 0)) {
        throw new ProfileValidationError("Body composition values are invalid");
      }
    }

    if (values.source && values.source.length > 80) {
      throw new ProfileValidationError("Source must be 80 characters or fewer");
    }

    if (values.measuredAt && !isNotFutureDate(values.measuredAt)) {
      throw new ProfileValidationError(
        "Measurement date cannot be in the future",
      );
    }

    const hasValue = Object.entries(values).some(
      ([key, value]) => key !== "measuredAt" && value !== null,
    );

    if (!existing && !hasValue) {
      throw new ProfileValidationError(
        "Enter at least one body composition value",
      );
    }

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create({ userId, ...values }));
  }

  private async syncMedicalHistories(
    manager: EntityManager,
    userId: string,
    items: UpdateMedicalHistoryInput[],
  ): Promise<void> {
    const repository = manager.getRepository(MedicalHistory);
    const existingRecords = await repository.find({ where: { userId } });
    const ids = items
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    if (ids.some((id) => !UUID_REGEX.test(id))) {
      throw new ProfileValidationError("Invalid medical history entry");
    }

    if (ids.length > 0) {
      const recordsById = await repository.find({ where: { id: In(ids) } });

      if (recordsById.some((record) => record.userId !== userId)) {
        throw new ProfileValidationError(
          "Medical history entry does not belong to you",
        );
      }
    }

    const existingById = new Map(existingRecords.map((record) => [record.id, record]));
    const retainedIds = new Set<string>();

    for (const item of items) {
      const existing = item.id ? existingById.get(item.id) : undefined;
      const conditionName = mergeRequiredText(
        item.conditionName,
        existing?.conditionName,
      );

      ensureRequired(conditionName, "Condition name");
      ensureLength(conditionName, 200, "Condition name");

      const diagnosisDate = mergeText(
        item.diagnosisDate,
        existing?.diagnosisDate,
      );

      if (diagnosisDate && !isNotFutureDate(diagnosisDate)) {
        throw new ProfileValidationError("Diagnosis date cannot be in the future");
      }

      const values = {
        userId,
        conditionName,
        description: mergeText(item.description, existing?.description),
        isActive: mergeBoolean(item.isActive, existing?.isActive),
        doctorAdvice: mergeText(item.doctorAdvice, existing?.doctorAdvice),
        treatmentDetails: mergeText(
          item.treatmentDetails,
          existing?.treatmentDetails,
        ),
        diagnosisDate,
        notes: mergeText(item.notes, existing?.notes),
      };

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);
        retainedIds.add(existing.id);
        continue;
      }

      const record = repository.create(values);

      if (item.id) {
        record.id = item.id;
      }

      await repository.save(record);
      retainedIds.add(record.id);
    }

    await repository.remove(
      existingRecords.filter((record) => !retainedIds.has(record.id)),
    );
  }

  private async syncMedications(
    manager: EntityManager,
    userId: string,
    items: UpdateMedicationInput[],
  ): Promise<void> {
    const repository = manager.getRepository(Medication);
    const existingRecords = await repository.find({ where: { userId } });
    const ids = items
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    if (ids.some((id) => !UUID_REGEX.test(id))) {
      throw new ProfileValidationError("Invalid medication entry");
    }

    if (ids.length > 0) {
      const recordsById = await repository.find({ where: { id: In(ids) } });

      if (recordsById.some((record) => record.userId !== userId)) {
        throw new ProfileValidationError(
          "Medication entry does not belong to you",
        );
      }
    }

    const existingById = new Map(existingRecords.map((record) => [record.id, record]));
    const retainedIds = new Set<string>();

    for (const item of items) {
      const existing = item.id ? existingById.get(item.id) : undefined;
      const medicineName = mergeRequiredText(
        item.medicineName,
        existing?.medicineName,
      );
      const dosage = mergeText(item.dosage, existing?.dosage);
      const startDate = mergeText(item.startDate, existing?.startDate);
      const endDate = mergeText(item.endDate, existing?.endDate);

      ensureRequired(medicineName, "Medicine name");
      ensureLength(medicineName, 200, "Medicine name");
      ensureLength(dosage, 150, "Medication dosage");

      if (startDate && !isValidDate(startDate)) {
        throw new ProfileValidationError("Enter a valid medication start date");
      }

      if (endDate && !isValidDate(endDate)) {
        throw new ProfileValidationError("Enter a valid medication end date");
      }

      if (startDate && endDate && endDate < startDate) {
        throw new ProfileValidationError(
          "Medication end date cannot be earlier than the start date",
        );
      }

      const values = {
        userId,
        medicineName,
        dosage,
        frequency: mergeText(item.frequency, existing?.frequency),
        startDate,
        endDate,
        reasonForTaking: mergeText(
          item.reasonForTaking,
          existing?.reasonForTaking,
        ),
        doctorPrescribed: mergeBoolean(
          item.doctorPrescribed,
          existing?.doctorPrescribed,
        ),
        notes: mergeText(item.notes, existing?.notes),
      };

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);
        retainedIds.add(existing.id);
        continue;
      }

      const record = repository.create(values);

      if (item.id) {
        record.id = item.id;
      }

      await repository.save(record);
      retainedIds.add(record.id);
    }

    await repository.remove(
      existingRecords.filter((record) => !retainedIds.has(record.id)),
    );
  }

  private async syncAllergies(
    manager: EntityManager,
    userId: string,
    items: UpdateAllergyInput[],
  ): Promise<void> {
    const repository = manager.getRepository(Allergy);
    const existingRecords = await repository.find({ where: { userId } });
    const ids = items
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    if (ids.some((id) => !UUID_REGEX.test(id))) {
      throw new ProfileValidationError("Invalid allergy entry");
    }

    if (ids.length > 0) {
      const recordsById = await repository.find({ where: { id: In(ids) } });

      if (recordsById.some((record) => record.userId !== userId)) {
        throw new ProfileValidationError("Allergy entry does not belong to you");
      }
    }

    const existingById = new Map(existingRecords.map((record) => [record.id, record]));
    const retainedIds = new Set<string>();

    for (const item of items) {
      const existing = item.id ? existingById.get(item.id) : undefined;
      const allergyName = mergeRequiredText(
        item.allergyName,
        existing?.allergyName,
      );

      ensureRequired(allergyName, "Allergy name");
      ensureLength(allergyName, 200, "Allergy name");

      const values = {
        userId,
        allergyName,
        allergyType: mergeText(item.allergyType, existing?.allergyType),
        severity: mergeText(item.severity, existing?.severity),
        reaction: mergeText(item.reaction, existing?.reaction),
        notes: mergeText(item.notes, existing?.notes),
      };

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);
        retainedIds.add(existing.id);
        continue;
      }

      const record = repository.create(values);

      if (item.id) {
        record.id = item.id;
      }

      await repository.save(record);
      retainedIds.add(record.id);
    }

    await repository.remove(
      existingRecords.filter((record) => !retainedIds.has(record.id)),
    );
  }

  private async updateFoodPreferences(
    manager: EntityManager,
    userId: string,
    input: UpdateFoodPreferencesInput,
  ): Promise<void> {
    const repository = manager.getRepository(FoodPreference);
    const existing = await repository.findOne({ where: { userId } });
    const dietType = mergeRequiredText(input.dietType, existing?.dietType);
    const cookingPreference = mergeRequiredText(
      input.cookingPreference,
      existing?.cookingPreference,
    );
    const dailyFoodBudget = mergeNumber(
      input.dailyFoodBudget,
      existing?.dailyFoodBudget,
    );
    const cookingTime = mergeNumber(input.cookingTime, existing?.cookingTime);

    ensureRequired(dietType, "Diet type");
    ensureLength(dietType, 50, "Diet type");
    ensureRequired(cookingPreference, "Cooking preference");
    ensureLength(cookingPreference, 30, "Cooking preference");

    if (dailyFoodBudget !== null && dailyFoodBudget < 0) {
      throw new ProfileValidationError("Daily food budget cannot be negative");
    }

    if (cookingTime !== null && (!Number.isInteger(cookingTime) || cookingTime <= 0)) {
      throw new ProfileValidationError("Cooking time must be greater than 0");
    }

    const values = {
      userId,
      dietType,
      preferredCuisine: mergeTextArray(
        input.preferredCuisine,
        existing?.preferredCuisine,
      ),
      foodAllergies: mergeTextArray(input.foodAllergies, existing?.foodAllergies),
      otherFoodAllergy: mergeText(
        input.otherFoodAllergy,
        existing?.otherFoodAllergy,
      ),
      foodIntolerances: mergeTextArray(
        input.foodIntolerances,
        existing?.foodIntolerances,
      ),
      otherFoodIntolerance: mergeText(
        input.otherFoodIntolerance,
        existing?.otherFoodIntolerance,
      ),
      dislikedFoods: mergeTextArray(input.dislikedFoods, existing?.dislikedFoods),
      favouriteFoods: mergeTextArray(
        input.favouriteFoods,
        existing?.favouriteFoods,
      ),
      dailyFoodBudget: decimal(dailyFoodBudget),
      cookingPreference,
      cookingTime: toInteger(cookingTime),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateEatingHabits(
    manager: EntityManager,
    userId: string,
    input: UpdateEatingHabitsInput,
  ): Promise<void> {
    const repository = manager.getRepository(EatingHabit);
    const existing = await repository.findOne({ where: { userId } });
    const mealsPerDay = mergeRequiredText(
      input.mealsPerDay,
      existing?.mealsPerDay,
    );
    const followsIntermittentFasting = mergeBoolean(
      input.followsIntermittentFasting,
      existing?.followsIntermittentFasting,
    );
    const breakfastTime = mergeText(input.breakfastTime, existing?.breakfastTime);
    const lunchTime = mergeText(input.lunchTime, existing?.lunchTime);
    const dinnerTime = mergeText(input.dinnerTime, existing?.dinnerTime);
    const fastingWindow = followsIntermittentFasting
      ? mergeText(input.fastingWindow, existing?.fastingWindow)
      : null;

    ensureRequired(mealsPerDay, "Meals per day");
    ensureLength(mealsPerDay, 30, "Meals per day");
    ensureTime(breakfastTime, "Breakfast time");
    ensureTime(lunchTime, "Lunch time");
    ensureTime(dinnerTime, "Dinner time");

    if (followsIntermittentFasting && !fastingWindow) {
      throw new ProfileValidationError("Select a valid fasting window");
    }

    const values = {
      userId,
      mealsPerDay,
      breakfastTime,
      lunchTime,
      dinnerTime,
      eatsSnacks: mergeBoolean(input.eatsSnacks, existing?.eatsSnacks),
      frequentlyEatsOutside: mergeBoolean(
        input.frequentlyEatsOutside,
        existing?.frequentlyEatsOutside,
      ),
      prefersHomemadeFood: mergeBoolean(
        input.prefersHomemadeFood,
        existing?.prefersHomemadeFood,
      ),
      followsIntermittentFasting,
      fastingWindow,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateFoodAvailability(
    manager: EntityManager,
    userId: string,
    input: UpdateFoodAvailabilityInput,
  ): Promise<void> {
    const repository = manager.getRepository(FoodAvailability);
    const existing = await repository.findOne({ where: { userId } });
    const values = {
      userId,
      availableIngredients: mergeTextArray(
        input.availableIngredients,
        existing?.availableIngredients,
      ),
      otherIngredients: mergeText(
        input.otherIngredients,
        existing?.otherIngredients,
      ),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateWorkoutPreferences(
    manager: EntityManager,
    userId: string,
    input: UpdateWorkoutPreferencesInput,
  ): Promise<void> {
    const repository = manager.getRepository(WorkoutPreference);
    const existing = await repository.findOne({ where: { userId } });
    const fitnessLevel = mergeRequiredText(
      input.fitnessLevel,
      existing?.fitnessLevel,
    );
    const workoutExperience = mergeRequiredText(
      input.workoutExperience,
      existing?.workoutExperience,
    );
    const workoutLocation = mergeRequiredText(
      input.workoutLocation,
      existing?.workoutLocation,
    );

    ensureRequired(fitnessLevel, "Fitness level");
    ensureLength(fitnessLevel, 30, "Fitness level");
    ensureRequired(workoutExperience, "Workout experience");
    ensureLength(workoutExperience, 50, "Workout experience");
    ensureRequired(workoutLocation, "Workout location");
    ensureLength(workoutLocation, 50, "Workout location");

    const hasGym =
      workoutLocation === "Gym" || workoutLocation === "Gym and Home";
    const values = {
      userId,
      fitnessLevel,
      workoutExperience,
      workoutLocation,
      gymMembership: hasGym
        ? mergeBoolean(input.gymMembership, existing?.gymMembership)
        : false,
      availableEquipment: mergeTextArray(
        input.availableEquipment,
        existing?.availableEquipment,
      ),
      otherEquipment: mergeText(
        input.otherEquipment,
        existing?.otherEquipment,
      ),
      preferredWorkouts: mergeTextArray(
        input.preferredWorkouts,
        existing?.preferredWorkouts,
      ),
      preferredSports: mergeTextArray(
        input.preferredSports,
        existing?.preferredSports,
      ),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateWorkoutSchedule(
    manager: EntityManager,
    userId: string,
    input: UpdateWorkoutScheduleInput,
  ): Promise<void> {
    const repository = manager.getRepository(WorkoutSchedule);
    const existing = await repository.findOne({ where: { userId } });
    const workoutDaysPerWeek = mergeNumber(
      input.workoutDaysPerWeek,
      existing?.workoutDaysPerWeek,
    );
    const workoutDuration = mergeRequiredText(
      input.workoutDuration,
      existing?.workoutDuration,
    );
    const preferredWorkoutTime = mergeRequiredText(
      input.preferredWorkoutTime,
      existing?.preferredWorkoutTime,
    );
    const preferredIntensity = mergeRequiredText(
      input.preferredIntensity,
      existing?.preferredIntensity,
    );
    const restDays = mergeTextArray(input.restDays, existing?.restDays);

    if (
      workoutDaysPerWeek === null ||
      !Number.isInteger(workoutDaysPerWeek) ||
      workoutDaysPerWeek < 1 ||
      workoutDaysPerWeek > 7
    ) {
      throw new ProfileValidationError(
        "Workout days per week must be between 1 and 7",
      );
    }

    ensureRequired(workoutDuration, "Workout duration");
    ensureLength(workoutDuration, 40, "Workout duration");
    ensureRequired(preferredWorkoutTime, "Preferred workout time");
    ensureLength(preferredWorkoutTime, 30, "Preferred workout time");
    ensureRequired(preferredIntensity, "Preferred intensity");
    ensureLength(preferredIntensity, 30, "Preferred intensity");

    if (restDays.length > 7 - workoutDaysPerWeek) {
      throw new ProfileValidationError(
        "Selected rest days do not fit the workout schedule",
      );
    }

    const values = {
      userId,
      workoutDaysPerWeek,
      workoutDuration,
      preferredWorkoutTime,
      restDays,
      preferredIntensity,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateExerciseRestrictions(
    manager: EntityManager,
    userId: string,
    input: UpdateExerciseRestrictionsInput,
  ): Promise<void> {
    const repository = manager.getRepository(ExerciseRestriction);
    const existing = await repository.findOne({ where: { userId } });
    const values = {
      userId,
      currentInjuries: mergeText(input.currentInjuries, existing?.currentInjuries),
      experiencesJointPain: mergeBoolean(
        input.experiencesJointPain,
        existing?.experiencesJointPain,
      ),
      restrictedExercises: mergeText(
        input.restrictedExercises,
        existing?.restrictedExercises,
      ),
      dislikedExercises: mergeText(
        input.dislikedExercises,
        existing?.dislikedExercises,
      ),
      doctorExerciseRestrictions: mergeText(
        input.doctorExerciseRestrictions,
        existing?.doctorExerciseRestrictions,
      ),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updateWorkLife(
    manager: EntityManager,
    userId: string,
    input: UpdateWorkLifeInput,
  ): Promise<void> {
    const repository = manager.getRepository(WorkLife);
    const existing = await repository.findOne({ where: { userId } });
    const workType = mergeRequiredText(input.workType, existing?.workType);
    const workStartTime = mergeText(input.workStartTime, existing?.workStartTime);
    const workEndTime = mergeText(input.workEndTime, existing?.workEndTime);
    const sleepTime = mergeRequiredText(input.sleepTime, existing?.sleepTime);
    const wakeUpTime = mergeRequiredText(input.wakeUpTime, existing?.wakeUpTime);
    const freeTime = mergeRequiredText(input.freeTime, existing?.freeTime);
    const dailySittingHours = mergeNumber(
      input.dailySittingHours,
      existing?.dailySittingHours,
    );
    const dailyStandingHours = mergeNumber(
      input.dailyStandingHours,
      existing?.dailyStandingHours,
    );
    const dailyCommuteTime = mergeNumber(
      input.dailyCommuteTime,
      existing?.dailyCommuteTime,
    );

    ensureRequired(workType, "Work type");
    ensureLength(workType, 80, "Work type");
    ensureTime(workStartTime, "Work start time");
    ensureTime(workEndTime, "Work end time");
    ensureTime(sleepTime, "Sleep time");
    ensureTime(wakeUpTime, "Wake up time");
    ensureRequired(sleepTime, "Sleep time");
    ensureRequired(wakeUpTime, "Wake up time");
    ensureRequired(freeTime, "Free time");
    ensureLength(freeTime, 50, "Free time");

    for (const value of [dailySittingHours, dailyStandingHours, dailyCommuteTime]) {
      if (value !== null && (!Number.isFinite(value) || value < 0)) {
        throw new ProfileValidationError("Daily routine numbers cannot be negative");
      }
    }

    if (dailyCommuteTime !== null && !Number.isInteger(dailyCommuteTime)) {
      throw new ProfileValidationError("Commute time must be a whole number");
    }

    const values = {
      userId,
      workType,
      workStartTime,
      workEndTime,
      workingDays: mergeTextArray(input.workingDays, existing?.workingDays),
      dailySittingHours: decimal(dailySittingHours),
      dailyStandingHours: decimal(dailyStandingHours),
      dailyCommuteTime: toInteger(dailyCommuteTime),
      sleepTime,
      wakeUpTime,
      stressLevel: mergeText(input.stressLevel, existing?.stressLevel),
      freeTime,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async updatePersonalization(
    manager: EntityManager,
    userId: string,
    input: UpdatePersonalizationInput,
  ): Promise<void> {
    const repository = manager.getRepository(Personalization);
    const existing = await repository.findOne({ where: { userId } });
    const preferredLanguage = mergeRequiredText(
      input.preferredLanguage,
      existing?.preferredLanguage,
    );
    const coachingStyle = mergeRequiredText(
      input.coachingStyle,
      existing?.coachingStyle,
    );
    const notificationFrequency = mergeRequiredText(
      input.notificationFrequency,
      existing?.notificationFrequency,
    );

    ensureRequired(preferredLanguage, "Preferred language");
    ensureLength(preferredLanguage, 50, "Preferred language");
    ensureRequired(coachingStyle, "Coaching style");
    ensureLength(coachingStyle, 50, "Coaching style");
    ensureRequired(notificationFrequency, "Notification frequency");
    ensureLength(notificationFrequency, 30, "Notification frequency");
    const dailyWaterTargetMl = mergeNumber(
      input.dailyWaterTargetMl,
      existing?.dailyWaterTargetMl,
    );
    const sleepGoalMinutes = mergeNumber(
      input.sleepGoalMinutes,
      existing?.sleepGoalMinutes,
    );

    if (
      dailyWaterTargetMl !== null &&
      (!Number.isInteger(dailyWaterTargetMl) ||
        dailyWaterTargetMl < 500 ||
        dailyWaterTargetMl > 10000)
    ) {
      throw new ProfileValidationError(
        "Daily water target must be between 500 and 10000 ml",
      );
    }

    if (
      sleepGoalMinutes !== null &&
      (!Number.isInteger(sleepGoalMinutes) ||
        sleepGoalMinutes < 60 ||
        sleepGoalMinutes > 1440)
    ) {
      throw new ProfileValidationError(
        "Sleep goal must be between 60 and 1440 minutes",
      );
    }

    const values = {
      userId,
      reminderPreference: mergeBoolean(
        input.reminderPreference,
        existing?.reminderPreference,
      ),
      waterReminder: mergeBoolean(input.waterReminder, existing?.waterReminder),
      mealReminder: mergeBoolean(input.mealReminder, existing?.mealReminder),
      workoutReminder: mergeBoolean(
        input.workoutReminder,
        existing?.workoutReminder,
      ),
      preferredLanguage,
      coachingStyle,
      notificationFrequency,
      dailyWaterTargetMl,
      sleepGoalMinutes,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }
}
