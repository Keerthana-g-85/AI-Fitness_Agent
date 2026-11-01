import type {
  EditableSection,
  MyProfile,
  UpdateMyProfileInput,
} from "../../types/profile";

export interface BasicForm {
  name: string;
  email: string;
  dateOfBirth: string;
  heightCm: string;
  gender: string;
  occupation: string;
  country: string;
  activityLevel: string;
}

export interface FitnessGoalForm {
  primaryGoal: string;
  secondaryGoal: string;
  currentWeightKg: string;
  targetWeightKg: string;
  targetBodyFatPercentage: string;
  targetMuscleMassKg: string;
  targetDate: string;
}

export interface BodyMeasurementForm {
  id: string | null;
  weightKg: string;
  neckCm: string;
  shoulderCm: string;
  chestCm: string;
  bustCm: string;
  waistCm: string;
  abdomenCm: string;
  hipCm: string;
  leftArmCm: string;
  rightArmCm: string;
  leftThighCm: string;
  rightThighCm: string;
  leftCalfCm: string;
  rightCalfCm: string;
  measuredAt: string;
  notes: string;
}

export interface BodyCompositionForm {
  id: string | null;
  bodyFatPercentage: string;
  fatMassKg: string;
  muscleMassKg: string;
  skeletalMuscleMassKg: string;
  leanBodyMassKg: string;
  bodyWaterPercentage: string;
  totalBodyWaterLiters: string;
  visceralFat: string;
  boneMassKg: string;
  proteinPercentage: string;
  bmrKcal: string;
  bmi: string;
  metabolicAge: string;
  source: string;
  measuredAt: string;
}

export interface MedicalHistoryForm {
  id: string | null;
  conditionName: string;
  description: string;
  isActive: boolean;
  doctorAdvice: string;
  treatmentDetails: string;
  diagnosisDate: string;
  notes: string;
}

export interface MedicationForm {
  id: string | null;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  reasonForTaking: string;
  doctorPrescribed: boolean;
  notes: string;
}

export interface AllergyForm {
  id: string | null;
  allergyName: string;
  allergyType: string;
  severity: string;
  reaction: string;
  notes: string;
}

export interface FoodForm {
  dietType: string;
  preferredCuisine: string[];
  foodAllergies: string[];
  otherFoodAllergy: string;
  foodIntolerances: string[];
  otherFoodIntolerance: string;
  dislikedFoods: string[];
  favouriteFoods: string[];
  dailyFoodBudget: string;
  cookingPreference: string;
  cookingTime: string;
  mealsPerDay: string;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  eatsSnacks: boolean;
  frequentlyEatsOutside: boolean;
  prefersHomemadeFood: boolean;
  followsIntermittentFasting: boolean;
  fastingWindow: string;
  availableIngredients: string[];
  otherIngredients: string;
}

export interface WorkoutForm {
  fitnessLevel: string;
  workoutExperience: string;
  workoutLocation: string;
  gymMembership: boolean;
  availableEquipment: string[];
  otherEquipment: string;
  preferredWorkouts: string[];
  preferredSports: string[];
  workoutDaysPerWeek: string;
  workoutDuration: string;
  preferredWorkoutTime: string;
  restDays: string[];
  preferredIntensity: string;
  currentInjuries: string;
  experiencesJointPain: boolean;
  restrictedExercises: string;
  dislikedExercises: string;
  doctorExerciseRestrictions: string;
}

export interface WorkLifeForm {
  workType: string;
  workStartTime: string;
  workEndTime: string;
  workingDays: string[];
  dailySittingHours: string;
  dailyStandingHours: string;
  dailyCommuteTime: string;
  sleepTime: string;
  wakeUpTime: string;
  stressLevel: string;
  freeTime: string;
  reminderPreference: boolean;
  waterReminder: boolean;
  mealReminder: boolean;
  workoutReminder: boolean;
  preferredLanguage: string;
  coachingStyle: string;
  notificationFrequency: string;
  dailyWaterTargetMl: string;
  sleepGoalMinutes: string;
}

export interface ProfileEditForm {
  basic: BasicForm;
  fitnessGoal: FitnessGoalForm;
  bodyMeasurement: BodyMeasurementForm;
  bodyComposition: BodyCompositionForm;
  medicalHistories: MedicalHistoryForm[];
  medications: MedicationForm[];
  allergies: AllergyForm[];
  food: FoodForm;
  workout: WorkoutForm;
  workLife: WorkLifeForm;
}

export type FormErrors = Record<string, string>;

const numberToText = (value: number | null | undefined): string =>
  value === null || value === undefined ? "" : String(value);

const text = (value: string | null | undefined): string => value ?? "";

export const emptyMedicalHistory = (): MedicalHistoryForm => ({
  id: null,
  conditionName: "",
  description: "",
  isActive: true,
  doctorAdvice: "",
  treatmentDetails: "",
  diagnosisDate: "",
  notes: "",
});

export const emptyMedication = (): MedicationForm => ({
  id: null,
  medicineName: "",
  dosage: "",
  frequency: "",
  startDate: "",
  endDate: "",
  reasonForTaking: "",
  doctorPrescribed: false,
  notes: "",
});

export const emptyAllergy = (): AllergyForm => ({
  id: null,
  allergyName: "",
  allergyType: "",
  severity: "",
  reaction: "",
  notes: "",
});

export const createProfileEditForm = (profile: MyProfile): ProfileEditForm => {
  const basic = profile.profile;
  const goal = profile.fitnessGoal;
  const measurement = profile.latestBodyMeasurement;
  const composition = profile.latestBodyComposition;
  const food = profile.foodPreferences;
  const eating = profile.eatingHabits;
  const availability = profile.foodAvailability;
  const workout = profile.workoutPreferences;
  const schedule = profile.workoutSchedule;
  const restrictions = profile.exerciseRestrictions;
  const workLife = profile.workLife;
  const personalization = profile.personalization;

  return {
    basic: {
      name: profile.user.name,
      email: profile.user.email,
      dateOfBirth: text(basic?.dateOfBirth),
      heightCm: numberToText(basic?.heightCm),
      gender: text(basic?.gender),
      occupation: text(basic?.occupation),
      country: text(basic?.country),
      activityLevel: text(basic?.activityLevel),
    },
    fitnessGoal: {
      primaryGoal: text(goal?.primaryGoal),
      secondaryGoal: text(goal?.secondaryGoal),
      currentWeightKg: numberToText(goal?.currentWeightKg),
      targetWeightKg: numberToText(goal?.targetWeightKg),
      targetBodyFatPercentage: numberToText(goal?.targetBodyFatPercentage),
      targetMuscleMassKg: numberToText(goal?.targetMuscleMassKg),
      targetDate: text(goal?.targetDate),
    },
    bodyMeasurement: {
      id: measurement?.id ?? null,
      weightKg: numberToText(measurement?.weightKg),
      neckCm: numberToText(measurement?.neckCm),
      shoulderCm: numberToText(measurement?.shoulderCm),
      chestCm: numberToText(measurement?.chestCm),
      bustCm: numberToText(measurement?.bustCm),
      waistCm: numberToText(measurement?.waistCm),
      abdomenCm: numberToText(measurement?.abdomenCm),
      hipCm: numberToText(measurement?.hipCm),
      leftArmCm: numberToText(measurement?.leftArmCm),
      rightArmCm: numberToText(measurement?.rightArmCm),
      leftThighCm: numberToText(measurement?.leftThighCm),
      rightThighCm: numberToText(measurement?.rightThighCm),
      leftCalfCm: numberToText(measurement?.leftCalfCm),
      rightCalfCm: numberToText(measurement?.rightCalfCm),
      measuredAt: text(measurement?.measuredAt),
      notes: text(measurement?.notes),
    },
    bodyComposition: {
      id: composition?.id ?? null,
      bodyFatPercentage: numberToText(composition?.bodyFatPercentage),
      fatMassKg: numberToText(composition?.fatMassKg),
      muscleMassKg: numberToText(composition?.muscleMassKg),
      skeletalMuscleMassKg: numberToText(composition?.skeletalMuscleMassKg),
      leanBodyMassKg: numberToText(composition?.leanBodyMassKg),
      bodyWaterPercentage: numberToText(composition?.bodyWaterPercentage),
      totalBodyWaterLiters: numberToText(composition?.totalBodyWaterLiters),
      visceralFat: numberToText(composition?.visceralFat),
      boneMassKg: numberToText(composition?.boneMassKg),
      proteinPercentage: numberToText(composition?.proteinPercentage),
      bmrKcal: numberToText(composition?.bmrKcal),
      bmi: numberToText(composition?.bmi),
      metabolicAge: numberToText(composition?.metabolicAge),
      source: text(composition?.source),
      measuredAt: text(composition?.measuredAt),
    },
    medicalHistories: profile.medicalHistories.map((item) => ({
      id: item.id,
      conditionName: item.conditionName,
      description: text(item.description),
      isActive: item.isActive,
      doctorAdvice: text(item.doctorAdvice),
      treatmentDetails: text(item.treatmentDetails),
      diagnosisDate: text(item.diagnosisDate),
      notes: text(item.notes),
    })),
    medications: profile.medications.map((item) => ({
      id: item.id,
      medicineName: item.medicineName,
      dosage: text(item.dosage),
      frequency: text(item.frequency),
      startDate: text(item.startDate),
      endDate: text(item.endDate),
      reasonForTaking: text(item.reasonForTaking),
      doctorPrescribed: item.doctorPrescribed,
      notes: text(item.notes),
    })),
    allergies: profile.allergies.map((item) => ({
      id: item.id,
      allergyName: item.allergyName,
      allergyType: text(item.allergyType),
      severity: text(item.severity),
      reaction: text(item.reaction),
      notes: text(item.notes),
    })),
    food: {
      dietType: text(food?.dietType),
      preferredCuisine: food?.preferredCuisine ?? [],
      foodAllergies: food?.foodAllergies ?? [],
      otherFoodAllergy: text(food?.otherFoodAllergy),
      foodIntolerances: food?.foodIntolerances ?? [],
      otherFoodIntolerance: text(food?.otherFoodIntolerance),
      dislikedFoods: food?.dislikedFoods ?? [],
      favouriteFoods: food?.favouriteFoods ?? [],
      dailyFoodBudget: numberToText(food?.dailyFoodBudget),
      cookingPreference: text(food?.cookingPreference),
      cookingTime: numberToText(food?.cookingTime),
      mealsPerDay: text(eating?.mealsPerDay),
      breakfastTime: text(eating?.breakfastTime),
      lunchTime: text(eating?.lunchTime),
      dinnerTime: text(eating?.dinnerTime),
      eatsSnacks: eating?.eatsSnacks ?? false,
      frequentlyEatsOutside: eating?.frequentlyEatsOutside ?? false,
      prefersHomemadeFood: eating?.prefersHomemadeFood ?? false,
      followsIntermittentFasting: eating?.followsIntermittentFasting ?? false,
      fastingWindow: text(eating?.fastingWindow),
      availableIngredients: availability?.availableIngredients ?? [],
      otherIngredients: text(availability?.otherIngredients),
    },
    workout: {
      fitnessLevel: text(workout?.fitnessLevel),
      workoutExperience: text(workout?.workoutExperience),
      workoutLocation: text(workout?.workoutLocation),
      gymMembership: workout?.gymMembership ?? false,
      availableEquipment: workout?.availableEquipment ?? [],
      otherEquipment: text(workout?.otherEquipment),
      preferredWorkouts: workout?.preferredWorkouts ?? [],
      preferredSports: workout?.preferredSports ?? [],
      workoutDaysPerWeek: numberToText(schedule?.workoutDaysPerWeek),
      workoutDuration: text(schedule?.workoutDuration),
      preferredWorkoutTime: text(schedule?.preferredWorkoutTime),
      restDays: schedule?.restDays ?? [],
      preferredIntensity: text(schedule?.preferredIntensity),
      currentInjuries: text(restrictions?.currentInjuries),
      experiencesJointPain: restrictions?.experiencesJointPain ?? false,
      restrictedExercises: text(restrictions?.restrictedExercises),
      dislikedExercises: text(restrictions?.dislikedExercises),
      doctorExerciseRestrictions: text(
        restrictions?.doctorExerciseRestrictions,
      ),
    },
    workLife: {
      workType: text(workLife?.workType),
      workStartTime: text(workLife?.workStartTime),
      workEndTime: text(workLife?.workEndTime),
      workingDays: workLife?.workingDays ?? [],
      dailySittingHours: numberToText(workLife?.dailySittingHours),
      dailyStandingHours: numberToText(workLife?.dailyStandingHours),
      dailyCommuteTime: numberToText(workLife?.dailyCommuteTime),
      sleepTime: text(workLife?.sleepTime),
      wakeUpTime: text(workLife?.wakeUpTime),
      stressLevel: text(workLife?.stressLevel),
      freeTime: text(workLife?.freeTime),
      reminderPreference: personalization?.reminderPreference ?? false,
      waterReminder: personalization?.waterReminder ?? false,
      mealReminder: personalization?.mealReminder ?? false,
      workoutReminder: personalization?.workoutReminder ?? false,
      preferredLanguage: text(personalization?.preferredLanguage),
      coachingStyle: text(personalization?.coachingStyle),
      notificationFrequency: text(personalization?.notificationFrequency),
      dailyWaterTargetMl: numberToText(personalization?.dailyWaterTargetMl),
      sleepGoalMinutes: numberToText(personalization?.sleepGoalMinutes),
    },
  };
};

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const todayString = (): string => {
  const today = new Date();

  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
};

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

const ageFromDate = (value: string): number => {
  const [year, month, day] = value.split("-").map(Number);
  const today = new Date();
  let age = today.getFullYear() - (year ?? 0);
  const monthDifference = today.getMonth() + 1 - (month ?? 0);

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < (day ?? 0))
  ) {
    age -= 1;
  }

  return age;
};

const number = (value: string): number | null => {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
};

const required = (value: string, label: string): string | undefined =>
  value.trim() ? undefined : `${label} is required`;

const positive = (value: string, label: string): string | undefined => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = number(value);

  return parsed === null || parsed <= 0
    ? `${label} must be greater than 0`
    : undefined;
};

const percentage = (value: string, label: string): string | undefined => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = number(value);

  return parsed === null || parsed < 0 || parsed > 100
    ? `${label} must be between 0 and 100`
    : undefined;
};

const nonNegative = (value: string, label: string): string | undefined => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = number(value);

  return parsed === null || parsed < 0
    ? `${label} cannot be negative`
    : undefined;
};

const wholeNumber = (
  value: string,
  label: string,
  minimum = 0,
): string | undefined => {
  if (value.trim() === "") {
    return undefined;
  }

  const parsed = number(value);

  return parsed === null || !Number.isInteger(parsed) || parsed < minimum
    ? `${label} must be a whole number${minimum > 0 ? ` of at least ${minimum}` : ""}`
    : undefined;
};

const dateError = (
  value: string,
  label: string,
  requirement: "past" | "future" | "any",
): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (!isValidDate(value)) {
    return `Enter a valid ${label.toLowerCase()}`;
  }

  if (requirement === "past" && value > todayString()) {
    return `${label} cannot be in the future`;
  }

  if (requirement === "future" && value <= todayString()) {
    return `${label} must be in the future`;
  }

  return undefined;
};

const timeError = (value: string, label: string): string | undefined =>
  value && !TIME_REGEX.test(value) ? `Enter a valid ${label.toLowerCase()}` : undefined;

const addError = (
  errors: FormErrors,
  key: string,
  message: string | undefined,
): void => {
  if (message) {
    errors[key] = message;
  }
};

export const validateProfileSection = (
  section: EditableSection,
  form: ProfileEditForm,
): FormErrors => {
  const errors: FormErrors = {};

  if (section === "basic") {
    addError(errors, "name", required(form.basic.name, "Name"));
    addError(
      errors,
      "email",
      !form.basic.email.trim()
        ? "Email is required"
        : !EMAIL_REGEX.test(form.basic.email.trim())
          ? "Enter a valid email address"
          : undefined,
    );
    addError(errors, "dateOfBirth", required(form.basic.dateOfBirth, "Date of birth"));
    addError(errors, "dateOfBirth", dateError(form.basic.dateOfBirth, "Date of birth", "past"));
    if (
      form.basic.dateOfBirth &&
      isValidDate(form.basic.dateOfBirth) &&
      ageFromDate(form.basic.dateOfBirth) > 120
    ) {
      addError(errors, "dateOfBirth", "Enter a valid date of birth");
    }
    addError(errors, "heightCm", required(form.basic.heightCm, "Height"));
    addError(errors, "heightCm", positive(form.basic.heightCm, "Height"));
    addError(errors, "gender", required(form.basic.gender, "Gender"));
    addError(errors, "country", required(form.basic.country, "Country"));
    addError(
      errors,
      "activityLevel",
      required(form.basic.activityLevel, "Activity level"),
    );
  }

  if (section === "fitnessGoal") {
    addError(errors, "primaryGoal", required(form.fitnessGoal.primaryGoal, "Primary goal"));
    if (
      form.fitnessGoal.secondaryGoal &&
      form.fitnessGoal.secondaryGoal === form.fitnessGoal.primaryGoal
    ) {
      addError(
        errors,
        "secondaryGoal",
        "Secondary goal must be different from the primary goal",
      );
    }
    addError(
      errors,
      "currentWeightKg",
      required(form.fitnessGoal.currentWeightKg, "Current weight"),
    );
    addError(errors, "currentWeightKg", positive(form.fitnessGoal.currentWeightKg, "Current weight"));
    addError(errors, "targetWeightKg", positive(form.fitnessGoal.targetWeightKg, "Target weight"));
    addError(
      errors,
      "targetBodyFatPercentage",
      percentage(form.fitnessGoal.targetBodyFatPercentage, "Target body fat"),
    );
    addError(
      errors,
      "targetMuscleMassKg",
      positive(form.fitnessGoal.targetMuscleMassKg, "Target muscle mass"),
    );
    addError(errors, "targetDate", dateError(form.fitnessGoal.targetDate, "Target date", "future"));
  }

  if (section === "bodyMeasurement") {
    const fields: Array<[keyof BodyMeasurementForm, string]> = [
      ["weightKg", "Weight"],
      ["neckCm", "Neck"],
      ["shoulderCm", "Shoulder"],
      ["chestCm", "Chest"],
      ["bustCm", "Bust"],
      ["waistCm", "Waist"],
      ["abdomenCm", "Abdomen"],
      ["hipCm", "Hip"],
      ["leftArmCm", "Left arm"],
      ["rightArmCm", "Right arm"],
      ["leftThighCm", "Left thigh"],
      ["rightThighCm", "Right thigh"],
      ["leftCalfCm", "Left calf"],
      ["rightCalfCm", "Right calf"],
    ];

    fields.forEach(([field, label]) => {
      addError(errors, field, positive(form.bodyMeasurement[field] as string, label));
    });
    addError(
      errors,
      "measuredAt",
      dateError(form.bodyMeasurement.measuredAt, "Measurement date", "past"),
    );

    const hasValue = fields.some(
      ([field]) => (form.bodyMeasurement[field] as string).trim() !== "",
    );

    if (!form.bodyMeasurement.id && !hasValue) {
      addError(errors, "weightKg", "Enter at least one body measurement value");
    }
  }

  if (section === "bodyComposition") {
    const positiveFields: Array<[keyof BodyCompositionForm, string]> = [
      ["fatMassKg", "Fat mass"],
      ["muscleMassKg", "Muscle mass"],
      ["skeletalMuscleMassKg", "Skeletal muscle mass"],
      ["leanBodyMassKg", "Lean body mass"],
      ["totalBodyWaterLiters", "Total body water"],
      ["boneMassKg", "Bone mass"],
      ["bmi", "BMI"],
    ];
    const percentages: Array<[keyof BodyCompositionForm, string]> = [
      ["bodyFatPercentage", "Body fat percentage"],
      ["bodyWaterPercentage", "Body water percentage"],
      ["proteinPercentage", "Protein percentage"],
    ];
    const integers: Array<[keyof BodyCompositionForm, string]> = [
      ["visceralFat", "Visceral fat"],
      ["bmrKcal", "BMR"],
      ["metabolicAge", "Metabolic age"],
    ];

    positiveFields.forEach(([field, label]) => {
      addError(errors, field, positive(form.bodyComposition[field] as string, label));
    });
    percentages.forEach(([field, label]) => {
      addError(errors, field, percentage(form.bodyComposition[field] as string, label));
    });
    integers.forEach(([field, label]) => {
      addError(errors, field, wholeNumber(form.bodyComposition[field] as string, label));
    });
    addError(
      errors,
      "measuredAt",
      dateError(form.bodyComposition.measuredAt, "Measurement date", "past"),
    );

    const hasValue =
      positiveFields.some(
        ([field]) => (form.bodyComposition[field] as string).trim() !== "",
      ) ||
      percentages.some(
        ([field]) => (form.bodyComposition[field] as string).trim() !== "",
      ) ||
      integers.some(
        ([field]) => (form.bodyComposition[field] as string).trim() !== "",
      );

    if (!form.bodyComposition.id && !hasValue) {
      addError(
        errors,
        "bodyFatPercentage",
        "Enter at least one body composition value",
      );
    }
  }

  if (section === "medicalHistories") {
    form.medicalHistories.forEach((item, index) => {
      addError(
        errors,
        `medical-${index}-conditionName`,
        required(item.conditionName, "Condition name"),
      );
      addError(
        errors,
        `medical-${index}-diagnosisDate`,
        dateError(item.diagnosisDate, "Diagnosis date", "past"),
      );
    });
  }

  if (section === "medications") {
    form.medications.forEach((item, index) => {
      addError(
        errors,
        `medication-${index}-medicineName`,
        required(item.medicineName, "Medicine name"),
      );
      addError(
        errors,
        `medication-${index}-startDate`,
        dateError(item.startDate, "Start date", "any"),
      );
      addError(
        errors,
        `medication-${index}-endDate`,
        dateError(item.endDate, "End date", "any"),
      );

      if (
        item.startDate &&
        item.endDate &&
        isValidDate(item.startDate) &&
        isValidDate(item.endDate) &&
        item.endDate < item.startDate
      ) {
        addError(
          errors,
          `medication-${index}-endDate`,
          "End date cannot be earlier than the start date",
        );
      }
    });
  }

  if (section === "allergies") {
    form.allergies.forEach((item, index) => {
      addError(
        errors,
        `allergy-${index}-allergyName`,
        required(item.allergyName, "Allergy name"),
      );
    });
  }

  if (section === "food") {
    addError(errors, "dietType", required(form.food.dietType, "Diet type"));
    addError(
      errors,
      "cookingPreference",
      required(form.food.cookingPreference, "Cooking preference"),
    );
    addError(errors, "dailyFoodBudget", nonNegative(form.food.dailyFoodBudget, "Daily food budget"));
    addError(
      errors,
      "cookingTime",
      wholeNumber(form.food.cookingTime, "Cooking time", 1),
    );
    addError(errors, "mealsPerDay", required(form.food.mealsPerDay, "Meals per day"));
    addError(errors, "breakfastTime", timeError(form.food.breakfastTime, "Breakfast time"));
    addError(errors, "lunchTime", timeError(form.food.lunchTime, "Lunch time"));
    addError(errors, "dinnerTime", timeError(form.food.dinnerTime, "Dinner time"));
    if (form.food.followsIntermittentFasting && !form.food.fastingWindow) {
      addError(errors, "fastingWindow", "Select a valid fasting window");
    }
  }

  if (section === "workout") {
    addError(errors, "fitnessLevel", required(form.workout.fitnessLevel, "Fitness level"));
    addError(
      errors,
      "workoutExperience",
      required(form.workout.workoutExperience, "Workout experience"),
    );
    addError(
      errors,
      "workoutLocation",
      required(form.workout.workoutLocation, "Workout location"),
    );
    addError(
      errors,
      "workoutDaysPerWeek",
      required(form.workout.workoutDaysPerWeek, "Workout days per week"),
    );
    const days = number(form.workout.workoutDaysPerWeek);
    if (days === null || !Number.isInteger(days) || days < 1 || days > 7) {
      addError(
        errors,
        "workoutDaysPerWeek",
        "Workout days per week must be between 1 and 7",
      );
    } else if (form.workout.restDays.length > 7 - days) {
      addError(
        errors,
        "restDays",
        "Selected rest days do not fit the workout schedule",
      );
    }
    addError(
      errors,
      "workoutDuration",
      required(form.workout.workoutDuration, "Workout duration"),
    );
    addError(
      errors,
      "preferredWorkoutTime",
      required(form.workout.preferredWorkoutTime, "Preferred workout time"),
    );
    addError(
      errors,
      "preferredIntensity",
      required(form.workout.preferredIntensity, "Preferred intensity"),
    );
  }

  if (section === "workLifeAndPersonalization") {
    addError(errors, "workType", required(form.workLife.workType, "Work type"));
    addError(errors, "sleepTime", required(form.workLife.sleepTime, "Sleep time"));
    addError(errors, "wakeUpTime", required(form.workLife.wakeUpTime, "Wake up time"));
    addError(errors, "freeTime", required(form.workLife.freeTime, "Free time"));
    addError(errors, "sleepTime", timeError(form.workLife.sleepTime, "Sleep time"));
    addError(errors, "wakeUpTime", timeError(form.workLife.wakeUpTime, "Wake up time"));
    addError(errors, "workStartTime", timeError(form.workLife.workStartTime, "Work start time"));
    addError(errors, "workEndTime", timeError(form.workLife.workEndTime, "Work end time"));
    addError(
      errors,
      "dailySittingHours",
      nonNegative(form.workLife.dailySittingHours, "Daily sitting hours"),
    );
    addError(
      errors,
      "dailyStandingHours",
      nonNegative(form.workLife.dailyStandingHours, "Daily standing hours"),
    );
    addError(
      errors,
      "dailyCommuteTime",
      wholeNumber(form.workLife.dailyCommuteTime, "Daily commute time"),
    );
    addError(
      errors,
      "preferredLanguage",
      required(form.workLife.preferredLanguage, "Preferred language"),
    );
    addError(
      errors,
      "coachingStyle",
      required(form.workLife.coachingStyle, "Coaching style"),
    );
    addError(
      errors,
      "notificationFrequency",
      required(form.workLife.notificationFrequency, "Notification frequency"),
    );
  }

  if (section === "preferences") {
    addError(
      errors,
      "preferredLanguage",
      required(form.workLife.preferredLanguage, "Preferred language"),
    );
    addError(
      errors,
      "coachingStyle",
      required(form.workLife.coachingStyle, "Coaching style"),
    );
    addError(
      errors,
      "notificationFrequency",
      required(form.workLife.notificationFrequency, "Notification frequency"),
    );
  }

  if (
    section === "workLifeAndPersonalization" ||
    section === "preferences"
  ) {
    addError(
      errors,
      "dailyWaterTargetMl",
      wholeNumber(form.workLife.dailyWaterTargetMl, "Daily water target", 500),
    );
    addError(
      errors,
      "sleepGoalMinutes",
      wholeNumber(form.workLife.sleepGoalMinutes, "Sleep goal", 60),
    );
  }

  return errors;
};

const nullableNumber = (value: string): number | null => number(value);

const nullableText = (value: string): string | null =>
  value.trim() === "" ? null : value.trim();

const nullableDate = (value: string): string | null =>
  value.trim() === "" ? null : value.trim();

export const buildProfileUpdateInput = (
  section: EditableSection,
  form: ProfileEditForm,
): UpdateMyProfileInput => {
  if (section === "basic") {
    return {
      basic: {
        name: form.basic.name.trim(),
        email: form.basic.email.trim(),
        dateOfBirth: form.basic.dateOfBirth,
        heightCm: nullableNumber(form.basic.heightCm),
        gender: form.basic.gender,
        occupation: nullableText(form.basic.occupation),
        country: form.basic.country.trim(),
        activityLevel: form.basic.activityLevel,
      },
    };
  }

  if (section === "fitnessGoal") {
    return {
      fitnessGoal: {
        primaryGoal: form.fitnessGoal.primaryGoal,
        secondaryGoal: nullableText(form.fitnessGoal.secondaryGoal),
        currentWeightKg: nullableNumber(form.fitnessGoal.currentWeightKg),
        targetWeightKg: nullableNumber(form.fitnessGoal.targetWeightKg),
        targetBodyFatPercentage: nullableNumber(
          form.fitnessGoal.targetBodyFatPercentage,
        ),
        targetMuscleMassKg: nullableNumber(form.fitnessGoal.targetMuscleMassKg),
        targetDate: nullableDate(form.fitnessGoal.targetDate),
      },
    };
  }

  if (section === "bodyMeasurement") {
    return {
      bodyMeasurement: {
        id: form.bodyMeasurement.id,
        weightKg: nullableNumber(form.bodyMeasurement.weightKg),
        neckCm: nullableNumber(form.bodyMeasurement.neckCm),
        shoulderCm: nullableNumber(form.bodyMeasurement.shoulderCm),
        chestCm: nullableNumber(form.bodyMeasurement.chestCm),
        bustCm: nullableNumber(form.bodyMeasurement.bustCm),
        waistCm: nullableNumber(form.bodyMeasurement.waistCm),
        abdomenCm: nullableNumber(form.bodyMeasurement.abdomenCm),
        hipCm: nullableNumber(form.bodyMeasurement.hipCm),
        leftArmCm: nullableNumber(form.bodyMeasurement.leftArmCm),
        rightArmCm: nullableNumber(form.bodyMeasurement.rightArmCm),
        leftThighCm: nullableNumber(form.bodyMeasurement.leftThighCm),
        rightThighCm: nullableNumber(form.bodyMeasurement.rightThighCm),
        leftCalfCm: nullableNumber(form.bodyMeasurement.leftCalfCm),
        rightCalfCm: nullableNumber(form.bodyMeasurement.rightCalfCm),
        measuredAt: nullableDate(form.bodyMeasurement.measuredAt),
        notes: nullableText(form.bodyMeasurement.notes),
      },
    };
  }

  if (section === "bodyComposition") {
    return {
      bodyComposition: {
        id: form.bodyComposition.id,
        bodyFatPercentage: nullableNumber(
          form.bodyComposition.bodyFatPercentage,
        ),
        fatMassKg: nullableNumber(form.bodyComposition.fatMassKg),
        muscleMassKg: nullableNumber(form.bodyComposition.muscleMassKg),
        skeletalMuscleMassKg: nullableNumber(
          form.bodyComposition.skeletalMuscleMassKg,
        ),
        leanBodyMassKg: nullableNumber(form.bodyComposition.leanBodyMassKg),
        bodyWaterPercentage: nullableNumber(
          form.bodyComposition.bodyWaterPercentage,
        ),
        totalBodyWaterLiters: nullableNumber(
          form.bodyComposition.totalBodyWaterLiters,
        ),
        visceralFat: nullableNumber(form.bodyComposition.visceralFat),
        boneMassKg: nullableNumber(form.bodyComposition.boneMassKg),
        proteinPercentage: nullableNumber(
          form.bodyComposition.proteinPercentage,
        ),
        bmrKcal: nullableNumber(form.bodyComposition.bmrKcal),
        bmi: nullableNumber(form.bodyComposition.bmi),
        metabolicAge: nullableNumber(form.bodyComposition.metabolicAge),
        source: nullableText(form.bodyComposition.source),
        measuredAt: nullableDate(form.bodyComposition.measuredAt),
      },
    };
  }

  if (section === "medicalHistories") {
    return {
      medicalHistories: form.medicalHistories.map((item) => ({
        id: item.id,
        conditionName: item.conditionName.trim(),
        description: nullableText(item.description),
        isActive: item.isActive,
        doctorAdvice: nullableText(item.doctorAdvice),
        treatmentDetails: nullableText(item.treatmentDetails),
        diagnosisDate: nullableDate(item.diagnosisDate),
        notes: nullableText(item.notes),
      })),
    };
  }

  if (section === "medications") {
    return {
      medications: form.medications.map((item) => ({
        id: item.id,
        medicineName: item.medicineName.trim(),
        dosage: nullableText(item.dosage),
        frequency: nullableText(item.frequency),
        startDate: nullableDate(item.startDate),
        endDate: nullableDate(item.endDate),
        reasonForTaking: nullableText(item.reasonForTaking),
        doctorPrescribed: item.doctorPrescribed,
        notes: nullableText(item.notes),
      })),
    };
  }

  if (section === "allergies") {
    return {
      allergies: form.allergies.map((item) => ({
        id: item.id,
        allergyName: item.allergyName.trim(),
        allergyType: nullableText(item.allergyType),
        severity: nullableText(item.severity),
        reaction: nullableText(item.reaction),
        notes: nullableText(item.notes),
      })),
    };
  }

  if (section === "food") {
    return {
      foodPreferences: {
        dietType: form.food.dietType,
        preferredCuisine: form.food.preferredCuisine,
        foodAllergies: form.food.foodAllergies,
        otherFoodAllergy: nullableText(form.food.otherFoodAllergy),
        foodIntolerances: form.food.foodIntolerances,
        otherFoodIntolerance: nullableText(form.food.otherFoodIntolerance),
        dislikedFoods: form.food.dislikedFoods,
        favouriteFoods: form.food.favouriteFoods,
        dailyFoodBudget: nullableNumber(form.food.dailyFoodBudget),
        cookingPreference: form.food.cookingPreference,
        cookingTime: nullableNumber(form.food.cookingTime),
      },
      eatingHabits: {
        mealsPerDay: form.food.mealsPerDay,
        breakfastTime: nullableDate(form.food.breakfastTime),
        lunchTime: nullableDate(form.food.lunchTime),
        dinnerTime: nullableDate(form.food.dinnerTime),
        eatsSnacks: form.food.eatsSnacks,
        frequentlyEatsOutside: form.food.frequentlyEatsOutside,
        prefersHomemadeFood: form.food.prefersHomemadeFood,
        followsIntermittentFasting: form.food.followsIntermittentFasting,
        fastingWindow: form.food.followsIntermittentFasting
          ? nullableText(form.food.fastingWindow)
          : null,
      },
      foodAvailability: {
        availableIngredients: form.food.availableIngredients,
        otherIngredients: nullableText(form.food.otherIngredients),
      },
    };
  }

  if (section === "workout") {
    return {
      workoutPreferences: {
        fitnessLevel: form.workout.fitnessLevel,
        workoutExperience: form.workout.workoutExperience,
        workoutLocation: form.workout.workoutLocation,
        gymMembership: form.workout.gymMembership,
        availableEquipment: form.workout.availableEquipment,
        otherEquipment: nullableText(form.workout.otherEquipment),
        preferredWorkouts: form.workout.preferredWorkouts,
        preferredSports: form.workout.preferredSports,
      },
      workoutSchedule: {
        workoutDaysPerWeek: nullableNumber(form.workout.workoutDaysPerWeek),
        workoutDuration: form.workout.workoutDuration,
        preferredWorkoutTime: form.workout.preferredWorkoutTime,
        restDays: form.workout.restDays,
        preferredIntensity: form.workout.preferredIntensity,
      },
      exerciseRestrictions: {
        currentInjuries: nullableText(form.workout.currentInjuries),
        experiencesJointPain: form.workout.experiencesJointPain,
        restrictedExercises: nullableText(form.workout.restrictedExercises),
        dislikedExercises: nullableText(form.workout.dislikedExercises),
        doctorExerciseRestrictions: nullableText(
          form.workout.doctorExerciseRestrictions,
        ),
      },
    };
  }

  if (section === "preferences") {
    return {
      personalization: {
        reminderPreference: form.workLife.reminderPreference,
        waterReminder: form.workLife.waterReminder,
        mealReminder: form.workLife.mealReminder,
        workoutReminder: form.workLife.workoutReminder,
        preferredLanguage: form.workLife.preferredLanguage,
        coachingStyle: form.workLife.coachingStyle,
        notificationFrequency: form.workLife.notificationFrequency,
        dailyWaterTargetMl: nullableNumber(form.workLife.dailyWaterTargetMl),
        sleepGoalMinutes: nullableNumber(form.workLife.sleepGoalMinutes),
      },
    };
  }

  return {
    workLife: {
      workType: form.workLife.workType,
      workStartTime: nullableDate(form.workLife.workStartTime),
      workEndTime: nullableDate(form.workLife.workEndTime),
      workingDays: form.workLife.workingDays,
      dailySittingHours: nullableNumber(form.workLife.dailySittingHours),
      dailyStandingHours: nullableNumber(form.workLife.dailyStandingHours),
      dailyCommuteTime: nullableNumber(form.workLife.dailyCommuteTime),
      sleepTime: form.workLife.sleepTime,
      wakeUpTime: form.workLife.wakeUpTime,
      stressLevel: nullableText(form.workLife.stressLevel),
      freeTime: form.workLife.freeTime,
    },
    personalization: {
      reminderPreference: form.workLife.reminderPreference,
      waterReminder: form.workLife.waterReminder,
      mealReminder: form.workLife.mealReminder,
      workoutReminder: form.workLife.workoutReminder,
      preferredLanguage: form.workLife.preferredLanguage,
      coachingStyle: form.workLife.coachingStyle,
      notificationFrequency: form.workLife.notificationFrequency,
      dailyWaterTargetMl: nullableNumber(form.workLife.dailyWaterTargetMl),
      sleepGoalMinutes: nullableNumber(form.workLife.sleepGoalMinutes),
    },
  };
};
