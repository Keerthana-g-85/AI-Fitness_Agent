import { EntityManager, In } from "typeorm";
import CompleteOnboardingInput, {
  BodyCompositionInput,
  BodyMeasurementInput,
} from "../Arguments/OnboardingArguments/CompleteOnboarding";
import Allergy from "../Model/Allergy";
import BodyComposition from "../Model/BodyComposition";
import BodyMeasurement from "../Model/BodyMeasurement";
import DataSharingConsent from "../Model/DataSharingConsent";
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
import OnboardingResponse from "../Response/OnboardingResponse";
import { database } from "../database";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const GENDERS = new Set(["Male", "Female", "Other", "Prefer not to say"]);
const ACTIVITY_LEVELS = new Set([
  "Sedentary",
  "Lightly active",
  "Moderately active",
  "Very active",
]);
const FITNESS_GOALS = new Set([
  "Weight Loss",
  "Weight Gain",
  "Muscle Gain",
  "Fat Loss",
  "Muscle Building",
  "Weight Maintenance",
  "Improve Fitness",
  "Improve Strength",
  "Improve Endurance",
  "General Health",
]);
const BODY_COMPOSITION_SOURCES = new Set([
  "Smart Scale",
  "Body Composition Analyzer",
  "Manual Measurement",
  "Other",
]);
const MEDICATION_FREQUENCIES = new Set([
  "Once Daily",
  "Twice Daily",
  "Three Times Daily",
  "Four Times Daily",
  "Weekly",
  "As Needed",
  "Other",
]);
const ALLERGY_TYPES = new Set([
  "Food",
  "Medicine",
  "Environmental",
  "Skin",
  "Other",
]);
const ALLERGY_SEVERITIES = new Set(["Mild", "Moderate", "Severe"]);
const DIET_TYPES = new Set(["Vegetarian", "Non-vegetarian", "Vegan", "Eggetarian"]);
const CUISINES = new Set([
  "South Indian",
  "North Indian",
  "Western",
  "Chinese",
  "Mediterranean",
  "Other",
]);
const FOOD_ALLERGENS = new Set([
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Other",
]);
const FOOD_INTOLERANCES = new Set(["Lactose", "Gluten", "Fructose", "Other"]);
const COOKING_PREFERENCES = new Set(["Home", "Outside", "Both"]);
const MEALS_PER_DAY = new Set([
  "2 meals",
  "3 meals",
  "4 meals",
  "5 meals",
  "6 or more meals",
]);
const FASTING_WINDOWS = new Set(["12:12", "14:10", "16:8", "18:6", "Other"]);
const INGREDIENTS = new Set([
  "Eggs",
  "Chicken",
  "Fish",
  "Rice",
  "Oats",
  "Milk",
  "Paneer",
  "Vegetables",
  "Fruits",
  "Nuts",
  "Dal",
  "Whole grains",
  "Tofu",
  "Other",
]);
const FITNESS_LEVELS = new Set(["Beginner", "Intermediate", "Advanced"]);
const WORKOUT_EXPERIENCES = new Set([
  "Never",
  "Less than 6 months",
  "6–12 months",
  "1–2 years",
  "More than 2 years",
]);
const WORKOUT_LOCATIONS = new Set(["Gym", "Home", "Outdoors", "Gym and Home"]);
const EQUIPMENT = new Set([
  "Dumbbells",
  "Barbells",
  "Resistance Bands",
  "Treadmill",
  "Exercise Bike",
  "Weight Machines",
  "Kettlebells",
  "Yoga Mat",
  "Pull-up Bar",
  "Other",
]);
const WORKOUT_PREFERENCES = new Set([
  "Strength Training",
  "Cardio",
  "HIIT",
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Yoga",
  "Pilates",
  "Weight Training",
  "Functional Training",
  "Sports",
]);
const WORKOUT_DURATIONS = new Set([
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "75 minutes",
  "90 minutes or more",
]);
const WORKOUT_TIMES = new Set([
  "Early Morning",
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Flexible",
]);
const WORKOUT_INTENSITIES = new Set(["Low", "Moderate", "High"]);
const WEEKDAYS = new Set([
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]);
const WORK_TYPES = new Set([
  "Office",
  "Work From Home",
  "Hybrid",
  "Physical Work",
  "Student",
  "Not Currently Working",
  "Other",
]);
const STRESS_LEVELS = new Set(["Low", "Medium", "High"]);
const FREE_TIME_OPTIONS = new Set([
  "Less than 15 minutes",
  "15–30 minutes",
  "30–45 minutes",
  "45–60 minutes",
  "More than 60 minutes",
  "Flexible",
]);
const LANGUAGES = new Set([
  "English",
  "Kannada",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Telugu",
  "Other",
]);
const COACHING_STYLES = new Set(["Friendly", "Motivational", "Strict", "Balanced"]);
const NOTIFICATION_FREQUENCIES = new Set(["Daily", "Weekly", "None"]);

const trimToNull = (value?: string | null): string | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

const normalizeTextArray = (values: string[]): string[] =>
  [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const isOneOf = (value: string, allowedValues: Set<string>): boolean =>
  allowedValues.has(value);

const areValidValues = (values: string[], allowedValues: Set<string>): boolean =>
  values.every((value) => allowedValues.has(value));

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

const isNotFutureDate = (value: string): boolean => {
  if (!isValidDate(value)) {
    return false;
  }

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return value <= todayString;
};

const isFutureDate = (value: string): boolean => {
  if (!isValidDate(value)) {
    return false;
  }

  const today = new Date();
  const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return value > todayString;
};

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

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDay)
  ) {
    age -= 1;
  }

  return age;
};

const isPositive = (value?: number | null): boolean =>
  value === null || value === undefined || (Number.isFinite(value) && value > 0);

const isNonNegative = (value?: number | null): boolean =>
  value === null || value === undefined || (Number.isFinite(value) && value >= 0);

const isPercentage = (value?: number | null): boolean =>
  value === null ||
  value === undefined ||
  (Number.isFinite(value) && value >= 0 && value <= 100);

const isValidTime = (value: string): boolean => TIME_REGEX.test(value);

const decimal = (value?: number | null): string | null =>
  value === null || value === undefined ? null : String(value);

const hasMeasurementData = (input?: BodyMeasurementInput | null): boolean =>
  Boolean(
    input &&
      ([
        input.weightKg,
        input.neckCm,
        input.shoulderCm,
        input.chestCm,
        input.bustCm,
        input.waistCm,
        input.abdomenCm,
        input.hipCm,
        input.leftArmCm,
        input.rightArmCm,
        input.leftThighCm,
        input.rightThighCm,
        input.leftCalfCm,
        input.rightCalfCm,
      ].some((value) => value !== null && value !== undefined) ||
        Boolean(trimToNull(input.measuredAt)) ||
        Boolean(trimToNull(input.notes))),
  );

const hasCompositionData = (input?: BodyCompositionInput | null): boolean =>
  Boolean(
    input &&
      ([
        input.bodyFatPercentage,
        input.fatMassKg,
        input.muscleMassKg,
        input.skeletalMuscleMassKg,
        input.leanBodyMassKg,
        input.bodyWaterPercentage,
        input.totalBodyWaterLiters,
        input.visceralFat,
        input.boneMassKg,
        input.proteinPercentage,
        input.bmrKcal,
        input.bmi,
        input.metabolicAge,
      ].some((value) => value !== null && value !== undefined) ||
        Boolean(trimToNull(input.source)) ||
        Boolean(trimToNull(input.measuredAt))),
  );

export default class OnboardingService {
  async completeOnboarding(
    authenticatedUserId: string | null | undefined,
    input: CompleteOnboardingInput,
  ): Promise<OnboardingResponse> {
    if (!authenticatedUserId || !UUID_REGEX.test(authenticatedUserId)) {
      return { success: false, message: "You must be logged in to complete onboarding" };
    }

    const validationMessage = this.validateInput(input);

    if (validationMessage) {
      return { success: false, message: validationMessage };
    }

    try {
      return await database.transaction(async (manager) => {
        const user = await manager
          .getRepository(User)
          .createQueryBuilder("user")
          .setLock("pessimistic_write")
          .where("user.id = :userId", { userId: authenticatedUserId })
          .getOne();

        if (!user) {
          return { success: false, message: "User not found" };
        }

        const completedAt = new Date();
        const insertedSubmissions: Array<{ id: string }> = await manager.query(
          `INSERT INTO "onboarding_submissions" ("user_id", "submission_id", "completed_at")
           VALUES ($1, $2, $3)
           ON CONFLICT ("user_id", "submission_id") DO NOTHING
           RETURNING "id"`,
          [authenticatedUserId, input.submissionId, completedAt],
        );

        if (insertedSubmissions.length === 0) {
          return {
            success: true,
            message: "Onboarding has already been completed",
          };
        }

        await this.saveProfile(manager, authenticatedUserId, input);
        await this.saveFitnessGoal(manager, authenticatedUserId, input);

        if (input.bodyMeasurement && hasMeasurementData(input.bodyMeasurement)) {
          await this.saveBodyMeasurement(manager, authenticatedUserId, input);
        }

        if (input.bodyComposition && hasCompositionData(input.bodyComposition)) {
          await this.saveBodyComposition(manager, authenticatedUserId, input);
        }

        await this.saveMedicalHistories(manager, authenticatedUserId, input);
        await this.saveMedications(manager, authenticatedUserId, input);
        await this.saveAllergies(manager, authenticatedUserId, input);
        await this.saveFoodPreferences(manager, authenticatedUserId, input);
        await this.saveEatingHabits(manager, authenticatedUserId, input);
        await this.saveFoodAvailability(manager, authenticatedUserId, input);
        await this.saveWorkoutPreferences(manager, authenticatedUserId, input);
        await this.saveWorkoutSchedule(manager, authenticatedUserId, input);
        await this.saveExerciseRestrictions(manager, authenticatedUserId, input);
        await this.saveWorkLife(manager, authenticatedUserId, input);
        await this.savePersonalization(manager, authenticatedUserId, input);
        await this.saveConsent(manager, authenticatedUserId, input, completedAt);

        user.onboardingCompleted = true;
        user.onboardingCompletedAt = completedAt;
        await manager.getRepository(User).save(user);

        return {
          success: true,
          message: "Onboarding completed successfully",
        };
      });
    } catch (error) {
      console.error("Onboarding submission failed:", error);

      return {
        success: false,
        message: "Unable to save onboarding information. Please try again.",
      };
    }
  }

  private validateInput(input: CompleteOnboardingInput): string | null {
    if (!UUID_REGEX.test(input.submissionId)) {
      return "Invalid onboarding submission ID";
    }

    const profile = input.profile;
    const profileAge = calculateAge(profile.dateOfBirth);

    if (
      !isValidDate(profile.dateOfBirth) ||
      !isNotFutureDate(profile.dateOfBirth) ||
      profileAge === null ||
      profileAge < 0 ||
      profileAge > 120
    ) {
      return "Enter a valid date of birth";
    }

    if (!Number.isFinite(profile.heightCm) || profile.heightCm <= 0) {
      return "Height must be a positive number";
    }

    if (!isOneOf(profile.gender, GENDERS)) {
      return "Select a valid gender";
    }

    if (profile.occupation && profile.occupation.trim().length > 150) {
      return "Occupation must be 150 characters or fewer";
    }

    if (!trimToNull(profile.country)) {
      return "Country is required";
    }

    if (!isOneOf(profile.activityLevel, ACTIVITY_LEVELS)) {
      return "Select a valid activity level";
    }

    const goal = input.fitnessGoal;

    if (!isOneOf(goal.primaryGoal, FITNESS_GOALS)) {
      return "Select a valid primary goal";
    }

    if (
      goal.secondaryGoal &&
      (!isOneOf(goal.secondaryGoal, FITNESS_GOALS) ||
        goal.secondaryGoal === goal.primaryGoal)
    ) {
      return "Secondary goal must be valid and different from the primary goal";
    }

    if (!Number.isFinite(goal.currentWeightKg) || goal.currentWeightKg <= 0) {
      return "Current weight must be greater than 0";
    }

    if (!isPositive(goal.targetWeightKg) || !isPositive(goal.targetMuscleMassKg)) {
      return "Target weight and muscle mass must be greater than 0";
    }

    if (!isPercentage(goal.targetBodyFatPercentage)) {
      return "Target body fat percentage must be between 0 and 100";
    }

    if (goal.targetDate && !isFutureDate(goal.targetDate)) {
      return "Target date must be in the future";
    }

    if (input.bodyMeasurement && !this.validateBodyMeasurement(input.bodyMeasurement)) {
      return "Body measurements must be positive numbers";
    }

    if (input.bodyComposition && !this.validateBodyComposition(input.bodyComposition)) {
      return "Body composition values are invalid";
    }

    for (const condition of input.medicalHistories) {
      if (condition.id && !UUID_REGEX.test(condition.id)) {
        return "Invalid medical history entry";
      }

      if (!trimToNull(condition.conditionName)) {
        return "Condition name is required";
      }

      if (condition.conditionName.trim().length > 200) {
        return "Condition name must be 200 characters or fewer";
      }

      if (condition.diagnosisDate && !isNotFutureDate(condition.diagnosisDate)) {
        return "Diagnosis date cannot be in the future";
      }
    }

    for (const medication of input.medications) {
      if (medication.id && !UUID_REGEX.test(medication.id)) {
        return "Invalid medication entry";
      }

      if (!trimToNull(medication.medicineName)) {
        return "Medicine name is required";
      }

      if (medication.medicineName.trim().length > 200) {
        return "Medicine name must be 200 characters or fewer";
      }

      if (medication.dosage && medication.dosage.trim().length > 150) {
        return "Medication dosage must be 150 characters or fewer";
      }

      if (
        medication.frequency &&
        !isOneOf(medication.frequency, MEDICATION_FREQUENCIES)
      ) {
        return "Select a valid medication frequency";
      }

      if (
        medication.startDate &&
        !isValidDate(medication.startDate)
      ) {
        return "Enter a valid medication start date";
      }

      if (medication.endDate && !isValidDate(medication.endDate)) {
        return "Enter a valid medication end date";
      }

      if (
        medication.startDate &&
        medication.endDate &&
        medication.endDate < medication.startDate
      ) {
        return "Medication end date cannot be earlier than the start date";
      }
    }

    for (const allergy of input.allergies) {
      if (allergy.id && !UUID_REGEX.test(allergy.id)) {
        return "Invalid allergy entry";
      }

      if (!trimToNull(allergy.allergyName)) {
        return "Allergy name is required";
      }

      if (allergy.allergyName.trim().length > 200) {
        return "Allergy name must be 200 characters or fewer";
      }

      if (allergy.allergyType && !isOneOf(allergy.allergyType, ALLERGY_TYPES)) {
        return "Select a valid allergy type";
      }

      if (allergy.severity && !isOneOf(allergy.severity, ALLERGY_SEVERITIES)) {
        return "Select a valid allergy severity";
      }
    }

    const food = input.foodPreferences;

    if (!isOneOf(food.dietType, DIET_TYPES)) {
      return "Select a valid diet type";
    }

    if (!areValidValues(normalizeTextArray(food.preferredCuisines), CUISINES)) {
      return "Select valid cuisines";
    }

    if (!areValidValues(normalizeTextArray(food.foodAllergies), FOOD_ALLERGENS)) {
      return "Select valid food allergies";
    }

    if (!areValidValues(normalizeTextArray(food.foodIntolerances), FOOD_INTOLERANCES)) {
      return "Select valid food intolerances";
    }

    if (!isNonNegative(food.dailyFoodBudget)) {
      return "Daily food budget cannot be negative";
    }

    if (!isOneOf(food.cookingPreference, COOKING_PREFERENCES)) {
      return "Select a valid cooking preference";
    }

    if (!isPositive(food.cookingTime)) {
      return "Cooking time must be greater than 0";
    }

    const habits = input.eatingHabits;

    if (!isOneOf(habits.mealsPerDay, MEALS_PER_DAY)) {
      return "Select a valid number of meals per day";
    }

    if (
      (habits.breakfastTime && !isValidTime(habits.breakfastTime)) ||
      (habits.lunchTime && !isValidTime(habits.lunchTime)) ||
      (habits.dinnerTime && !isValidTime(habits.dinnerTime))
    ) {
      return "Enter valid meal times";
    }

    if (
      habits.followsIntermittentFasting &&
      (!habits.fastingWindow || !isOneOf(habits.fastingWindow, FASTING_WINDOWS))
    ) {
      return "Select a valid fasting window";
    }

    const availability = input.foodAvailability;

    if (!areValidValues(normalizeTextArray(availability.availableIngredients), INGREDIENTS)) {
      return "Select valid available ingredients";
    }

    const workout = input.workoutPreferences;

    if (!isOneOf(workout.fitnessLevel, FITNESS_LEVELS)) {
      return "Select a valid fitness level";
    }

    if (!isOneOf(workout.workoutExperience, WORKOUT_EXPERIENCES)) {
      return "Select a valid workout experience";
    }

    if (!isOneOf(workout.workoutLocation, WORKOUT_LOCATIONS)) {
      return "Select a valid workout location";
    }

    if (!areValidValues(normalizeTextArray(workout.availableEquipment), EQUIPMENT)) {
      return "Select valid equipment";
    }

    const preferredWorkouts = normalizeTextArray(workout.preferredWorkouts);

    if (
      preferredWorkouts.length === 0 ||
      !areValidValues(preferredWorkouts, WORKOUT_PREFERENCES)
    ) {
      return "Select at least one valid workout preference";
    }

    const schedule = input.workoutSchedule;

    if (
      !Number.isInteger(schedule.workoutDaysPerWeek) ||
      schedule.workoutDaysPerWeek < 1 ||
      schedule.workoutDaysPerWeek > 7
    ) {
      return "Workout days per week must be between 1 and 7";
    }

    if (!isOneOf(schedule.workoutDuration, WORKOUT_DURATIONS)) {
      return "Select a valid workout duration";
    }

    if (!isOneOf(schedule.preferredWorkoutTime, WORKOUT_TIMES)) {
      return "Select a valid preferred workout time";
    }

    const restDays = normalizeTextArray(schedule.restDays);

    if (!areValidValues(restDays, WEEKDAYS)) {
      return "Select valid rest days";
    }

    if (restDays.length > 7 - schedule.workoutDaysPerWeek) {
      return "Selected rest days do not fit the workout schedule";
    }

    if (!isOneOf(schedule.preferredIntensity, WORKOUT_INTENSITIES)) {
      return "Select a valid workout intensity";
    }

    const workLife = input.workLife;

    if (!isOneOf(workLife.workType, WORK_TYPES)) {
      return "Select a valid work type";
    }

    if (
      (workLife.workStartTime && !isValidTime(workLife.workStartTime)) ||
      (workLife.workEndTime && !isValidTime(workLife.workEndTime))
    ) {
      return "Enter valid work times";
    }

    if (!areValidValues(normalizeTextArray(workLife.workingDays), WEEKDAYS)) {
      return "Select valid working days";
    }

    if (
      !isNonNegative(workLife.dailySittingHours) ||
      !isNonNegative(workLife.dailyStandingHours) ||
      !isNonNegative(workLife.dailyCommuteTime)
    ) {
      return "Daily routine numbers cannot be negative";
    }

    if (!isValidTime(workLife.sleepTime) || !isValidTime(workLife.wakeUpTime)) {
      return "Enter valid sleep and wake up times";
    }

    if (workLife.stressLevel && !isOneOf(workLife.stressLevel, STRESS_LEVELS)) {
      return "Select a valid stress level";
    }

    if (!isOneOf(workLife.freeTime, FREE_TIME_OPTIONS)) {
      return "Select valid free time for exercise";
    }

    const personalization = input.personalization;

    if (!isOneOf(personalization.preferredLanguage, LANGUAGES)) {
      return "Select a valid preferred language";
    }

    if (!isOneOf(personalization.coachingStyle, COACHING_STYLES)) {
      return "Select a valid coaching style";
    }

    if (!isOneOf(personalization.notificationFrequency, NOTIFICATION_FREQUENCIES)) {
      return "Select a valid notification frequency";
    }

    if (!input.dataSharingConsent.consentGiven) {
      return "Data sharing consent is required";
    }

    if (!trimToNull(input.dataSharingConsent.consentVersion)) {
      return "Consent version is required";
    }

    if (input.dataSharingConsent.consentVersion.trim().length > 50) {
      return "Consent version must be 50 characters or fewer";
    }

    return null;
  }

  private validateBodyMeasurement(input: BodyMeasurementInput): boolean {
    const numericValues = [
      input.weightKg,
      input.neckCm,
      input.shoulderCm,
      input.chestCm,
      input.bustCm,
      input.waistCm,
      input.abdomenCm,
      input.hipCm,
      input.leftArmCm,
      input.rightArmCm,
      input.leftThighCm,
      input.rightThighCm,
      input.leftCalfCm,
      input.rightCalfCm,
    ];

    return (
      numericValues.every(isPositive) &&
      (!input.measuredAt || isNotFutureDate(input.measuredAt))
    );
  }

  private validateBodyComposition(input: BodyCompositionInput): boolean {
    return (
      isPercentage(input.bodyFatPercentage) &&
      isPercentage(input.bodyWaterPercentage) &&
      isPercentage(input.proteinPercentage) &&
      [
        input.fatMassKg,
        input.muscleMassKg,
        input.skeletalMuscleMassKg,
        input.leanBodyMassKg,
        input.totalBodyWaterLiters,
        input.visceralFat,
        input.boneMassKg,
        input.bmrKcal,
        input.bmi,
        input.metabolicAge,
      ].every(isPositive) &&
      (!input.source || isOneOf(input.source, BODY_COMPOSITION_SOURCES)) &&
      (!input.measuredAt || isNotFutureDate(input.measuredAt))
    );
  }

  private async saveProfile(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(UserProfile);
    const existing = await repository.findOne({ where: { userId } });
    const values = {
      userId,
      dateOfBirth: input.profile.dateOfBirth,
      heightCm: String(input.profile.heightCm),
      gender: input.profile.gender,
      occupation: trimToNull(input.profile.occupation),
      country: input.profile.country.trim(),
      activityLevel: input.profile.activityLevel,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveFitnessGoal(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    await manager.getRepository(FitnessGoal).save(
      manager.getRepository(FitnessGoal).create({
        userId,
        primaryGoal: input.fitnessGoal.primaryGoal,
        secondaryGoal: trimToNull(input.fitnessGoal.secondaryGoal),
        currentWeightKg: String(input.fitnessGoal.currentWeightKg),
        targetWeightKg: decimal(input.fitnessGoal.targetWeightKg),
        targetBodyFatPercentage: decimal(input.fitnessGoal.targetBodyFatPercentage),
        targetMuscleMassKg: decimal(input.fitnessGoal.targetMuscleMassKg),
        targetDate: input.fitnessGoal.targetDate ?? null,
      }),
    );
  }

  private async saveBodyMeasurement(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const measurement = input.bodyMeasurement;

    if (!measurement) {
      return;
    }

    await manager.getRepository(BodyMeasurement).save(
      manager.getRepository(BodyMeasurement).create({
        userId,
        weightKg: decimal(measurement.weightKg),
        neckCm: decimal(measurement.neckCm),
        shoulderCm: decimal(measurement.shoulderCm),
        chestCm: decimal(measurement.chestCm),
        bustCm: decimal(measurement.bustCm),
        waistCm: decimal(measurement.waistCm),
        abdomenCm: decimal(measurement.abdomenCm),
        hipCm: decimal(measurement.hipCm),
        leftArmCm: decimal(measurement.leftArmCm),
        rightArmCm: decimal(measurement.rightArmCm),
        leftThighCm: decimal(measurement.leftThighCm),
        rightThighCm: decimal(measurement.rightThighCm),
        leftCalfCm: decimal(measurement.leftCalfCm),
        rightCalfCm: decimal(measurement.rightCalfCm),
        measuredAt: measurement.measuredAt ?? null,
        notes: trimToNull(measurement.notes),
      }),
    );
  }

  private async saveBodyComposition(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const composition = input.bodyComposition;

    if (!composition) {
      return;
    }

    await manager.getRepository(BodyComposition).save(
      manager.getRepository(BodyComposition).create({
        userId,
        bodyFatPercentage: decimal(composition.bodyFatPercentage),
        fatMassKg: decimal(composition.fatMassKg),
        muscleMassKg: decimal(composition.muscleMassKg),
        skeletalMuscleMassKg: decimal(composition.skeletalMuscleMassKg),
        leanBodyMassKg: decimal(composition.leanBodyMassKg),
        bodyWaterPercentage: decimal(composition.bodyWaterPercentage),
        totalBodyWaterLiters: decimal(composition.totalBodyWaterLiters),
        visceralFat: composition.visceralFat ?? null,
        boneMassKg: decimal(composition.boneMassKg),
        proteinPercentage: decimal(composition.proteinPercentage),
        bmrKcal: composition.bmrKcal ?? null,
        bmi: decimal(composition.bmi),
        metabolicAge: composition.metabolicAge ?? null,
        source: trimToNull(composition.source),
        measuredAt: composition.measuredAt ?? null,
      }),
    );
  }

  private async saveMedicalHistories(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(MedicalHistory);
    const existingRecords = await repository.find({ where: { userId } });
    const inputIds = input.medicalHistories
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    if (inputIds.length > 0) {
      const recordsById = await repository.find({ where: { id: In(inputIds) } });

      if (recordsById.some((record) => record.userId !== userId)) {
        throw new Error("Medical history entry does not belong to the authenticated user");
      }
    }

    const existingById = new Map(existingRecords.map((record) => [record.id, record]));
    const retainedIds = new Set<string>();

    for (const item of input.medicalHistories) {
      const values = {
        userId,
        conditionName: item.conditionName.trim(),
        description: trimToNull(item.description),
        isActive: item.isActive,
        doctorAdvice: trimToNull(item.doctorAdvice),
        treatmentDetails: trimToNull(item.treatmentDetails),
        diagnosisDate: item.diagnosisDate ?? null,
        notes: trimToNull(item.notes),
      };
      const existing = item.id ? existingById.get(item.id) : undefined;

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);
        retainedIds.add(existing.id);
      } else {
        const record = repository.create(values);

        if (item.id) {
          record.id = item.id;
        }

        await repository.save(record);
        retainedIds.add(record.id);
      }
    }

    await repository.remove(
      existingRecords.filter((record) => !retainedIds.has(record.id)),
    );
  }

  private async saveMedications(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(Medication);
    const existingRecords = await repository.find({ where: { userId } });
    const inputIds = input.medications
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    if (inputIds.length > 0) {
      const recordsById = await repository.find({ where: { id: In(inputIds) } });

      if (recordsById.some((record) => record.userId !== userId)) {
        throw new Error("Medication entry does not belong to the authenticated user");
      }
    }

    const existingById = new Map(existingRecords.map((record) => [record.id, record]));
    const retainedIds = new Set<string>();

    for (const item of input.medications) {
      const values = {
        userId,
        medicineName: item.medicineName.trim(),
        dosage: trimToNull(item.dosage),
        frequency: trimToNull(item.frequency),
        startDate: item.startDate ?? null,
        endDate: item.endDate ?? null,
        reasonForTaking: trimToNull(item.reasonForTaking),
        doctorPrescribed: item.doctorPrescribed,
        notes: trimToNull(item.notes),
      };
      const existing = item.id ? existingById.get(item.id) : undefined;

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);
        retainedIds.add(existing.id);
      } else {
        const record = repository.create(values);

        if (item.id) {
          record.id = item.id;
        }

        await repository.save(record);
        retainedIds.add(record.id);
      }
    }

    await repository.remove(
      existingRecords.filter((record) => !retainedIds.has(record.id)),
    );
  }

  private async saveAllergies(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(Allergy);
    const existingRecords = await repository.find({ where: { userId } });
    const inputIds = input.allergies
      .map((item) => item.id)
      .filter((id): id is string => Boolean(id));

    if (inputIds.length > 0) {
      const recordsById = await repository.find({ where: { id: In(inputIds) } });

      if (recordsById.some((record) => record.userId !== userId)) {
        throw new Error("Allergy entry does not belong to the authenticated user");
      }
    }

    const existingById = new Map(existingRecords.map((record) => [record.id, record]));
    const retainedIds = new Set<string>();

    for (const item of input.allergies) {
      const values = {
        userId,
        allergyName: item.allergyName.trim(),
        allergyType: trimToNull(item.allergyType),
        severity: trimToNull(item.severity),
        reaction: trimToNull(item.reaction),
        notes: trimToNull(item.notes),
      };
      const existing = item.id ? existingById.get(item.id) : undefined;

      if (existing) {
        Object.assign(existing, values);
        await repository.save(existing);
        retainedIds.add(existing.id);
      } else {
        const record = repository.create(values);

        if (item.id) {
          record.id = item.id;
        }

        await repository.save(record);
        retainedIds.add(record.id);
      }
    }

    await repository.remove(
      existingRecords.filter((record) => !retainedIds.has(record.id)),
    );
  }

  private async saveFoodPreferences(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(FoodPreference);
    const existing = await repository.findOne({ where: { userId } });
    const values = {
      userId,
      dietType: input.foodPreferences.dietType,
      preferredCuisine: normalizeTextArray(input.foodPreferences.preferredCuisines),
      foodAllergies: normalizeTextArray(input.foodPreferences.foodAllergies),
      otherFoodAllergy: trimToNull(input.foodPreferences.otherFoodAllergy),
      foodIntolerances: normalizeTextArray(input.foodPreferences.foodIntolerances),
      otherFoodIntolerance: trimToNull(input.foodPreferences.otherFoodIntolerance),
      dislikedFoods: normalizeTextArray(input.foodPreferences.dislikedFoods),
      favouriteFoods: normalizeTextArray(input.foodPreferences.favouriteFoods),
      dailyFoodBudget: decimal(input.foodPreferences.dailyFoodBudget),
      cookingPreference: input.foodPreferences.cookingPreference,
      cookingTime: input.foodPreferences.cookingTime ?? null,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveEatingHabits(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(EatingHabit);
    const existing = await repository.findOne({ where: { userId } });
    const habits = input.eatingHabits;
    const values = {
      userId,
      mealsPerDay: habits.mealsPerDay,
      breakfastTime: habits.breakfastTime ?? null,
      lunchTime: habits.lunchTime ?? null,
      dinnerTime: habits.dinnerTime ?? null,
      eatsSnacks: habits.eatsSnacks,
      frequentlyEatsOutside: habits.frequentlyEatsOutside,
      prefersHomemadeFood: habits.prefersHomemadeFood,
      followsIntermittentFasting: habits.followsIntermittentFasting,
      fastingWindow: habits.followsIntermittentFasting
        ? habits.fastingWindow ?? null
        : null,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveFoodAvailability(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(FoodAvailability);
    const existing = await repository.findOne({ where: { userId } });
    const values = {
      userId,
      availableIngredients: normalizeTextArray(input.foodAvailability.availableIngredients),
      otherIngredients: trimToNull(input.foodAvailability.otherIngredients),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveWorkoutPreferences(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(WorkoutPreference);
    const existing = await repository.findOne({ where: { userId } });
    const workout = input.workoutPreferences;
    const gymMembership =
      workout.workoutLocation === "Gym" || workout.workoutLocation === "Gym and Home"
        ? workout.gymMembership
        : false;
    const values = {
      userId,
      fitnessLevel: workout.fitnessLevel,
      workoutExperience: workout.workoutExperience,
      workoutLocation: workout.workoutLocation,
      gymMembership,
      availableEquipment: normalizeTextArray(workout.availableEquipment),
      otherEquipment: trimToNull(workout.otherEquipment),
      preferredWorkouts: normalizeTextArray(workout.preferredWorkouts),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveWorkoutSchedule(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(WorkoutSchedule);
    const existing = await repository.findOne({ where: { userId } });
    const schedule = input.workoutSchedule;
    const values = {
      userId,
      workoutDaysPerWeek: schedule.workoutDaysPerWeek,
      workoutDuration: schedule.workoutDuration,
      preferredWorkoutTime: schedule.preferredWorkoutTime,
      restDays: normalizeTextArray(schedule.restDays),
      preferredIntensity: schedule.preferredIntensity,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveExerciseRestrictions(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(ExerciseRestriction);
    const existing = await repository.findOne({ where: { userId } });
    const restrictions = input.exerciseRestrictions;
    const values = {
      userId,
      currentInjuries: trimToNull(restrictions.currentInjuries),
      experiencesJointPain: restrictions.experiencesJointPain,
      restrictedExercises: trimToNull(restrictions.restrictedExercises),
      dislikedExercises: trimToNull(restrictions.dislikedExercises),
      doctorExerciseRestrictions: trimToNull(restrictions.doctorExerciseRestrictions),
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveWorkLife(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(WorkLife);
    const existing = await repository.findOne({ where: { userId } });
    const workLife = input.workLife;
    const values = {
      userId,
      workType: workLife.workType,
      workStartTime: workLife.workStartTime ?? null,
      workEndTime: workLife.workEndTime ?? null,
      workingDays: normalizeTextArray(workLife.workingDays),
      dailySittingHours: decimal(workLife.dailySittingHours),
      dailyStandingHours: decimal(workLife.dailyStandingHours),
      dailyCommuteTime: workLife.dailyCommuteTime ?? null,
      sleepTime: workLife.sleepTime,
      wakeUpTime: workLife.wakeUpTime,
      stressLevel: trimToNull(workLife.stressLevel),
      freeTime: workLife.freeTime,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async savePersonalization(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
  ): Promise<void> {
    const repository = manager.getRepository(Personalization);
    const existing = await repository.findOne({ where: { userId } });
    const personalization = input.personalization;
    const remindersEnabled = personalization.reminderPreference;
    const values = {
      userId,
      reminderPreference: remindersEnabled,
      waterReminder: remindersEnabled ? personalization.waterReminder : false,
      mealReminder: remindersEnabled ? personalization.mealReminder : false,
      workoutReminder: remindersEnabled ? personalization.workoutReminder : false,
      preferredLanguage: personalization.preferredLanguage,
      coachingStyle: personalization.coachingStyle,
      notificationFrequency: personalization.notificationFrequency,
    };

    if (existing) {
      Object.assign(existing, values);
      await repository.save(existing);
      return;
    }

    await repository.save(repository.create(values));
  }

  private async saveConsent(
    manager: EntityManager,
    userId: string,
    input: CompleteOnboardingInput,
    completedAt: Date,
  ): Promise<void> {
    await manager.getRepository(DataSharingConsent).save(
      manager.getRepository(DataSharingConsent).create({
        userId,
        consentGiven: input.dataSharingConsent.consentGiven,
        consentVersion: input.dataSharingConsent.consentVersion.trim(),
        consentedAt: completedAt,
        withdrawnAt: null,
      }),
    );
  }
}
