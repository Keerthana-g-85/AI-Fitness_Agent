export type Gender = "Male" | "Female" | "Other" | "Prefer not to say";

export type ActivityLevel =
  | "Sedentary"
  | "Lightly active"
  | "Moderately active"
  | "Very active";

export type FitnessGoalOption =
  | "Weight Loss"
  | "Weight Gain"
  | "Muscle Gain"
  | "Fat Loss"
  | "Muscle Building"
  | "Weight Maintenance"
  | "Improve Fitness"
  | "Improve Strength"
  | "Improve Endurance"
  | "General Health";

export type BodyCompositionSource =
  | "Smart Scale"
  | "Body Composition Analyzer"
  | "Manual Measurement"
  | "Other";

export type MedicationFrequency =
  | "Once Daily"
  | "Twice Daily"
  | "Three Times Daily"
  | "Four Times Daily"
  | "Weekly"
  | "As Needed"
  | "Other";

export type AllergyType =
  | "Food"
  | "Medicine"
  | "Environmental"
  | "Skin"
  | "Other";

export type AllergySeverity = "Mild" | "Moderate" | "Severe";

export type DietType =
  | "Vegetarian"
  | "Non-vegetarian"
  | "Vegan"
  | "Eggetarian";

export type PreferredCuisine =
  | "South Indian"
  | "North Indian"
  | "Western"
  | "Chinese"
  | "Mediterranean"
  | "Other";

export type FoodAllergen =
  | "Peanuts"
  | "Tree Nuts"
  | "Milk"
  | "Eggs"
  | "Soy"
  | "Wheat"
  | "Fish"
  | "Shellfish"
  | "Other";

export type FoodIntolerance =
  | "Lactose"
  | "Gluten"
  | "Fructose"
  | "Other";

export type CookingPreference = "Home" | "Outside" | "Both";

export type MealsPerDay =
  | "2 meals"
  | "3 meals"
  | "4 meals"
  | "5 meals"
  | "6 or more meals";

export type FastingWindow = "12:12" | "14:10" | "16:8" | "18:6" | "Other";

export type Ingredient =
  | "Eggs"
  | "Chicken"
  | "Fish"
  | "Rice"
  | "Oats"
  | "Milk"
  | "Paneer"
  | "Vegetables"
  | "Fruits"
  | "Nuts"
  | "Dal"
  | "Whole grains"
  | "Tofu"
  | "Other";

export type FitnessLevel = "Beginner" | "Intermediate" | "Advanced";

export type WorkoutExperienceOption =
  | "Never"
  | "Less than 6 months"
  | "6–12 months"
  | "1–2 years"
  | "More than 2 years";

export type WorkoutLocation = "Gym" | "Home" | "Outdoors" | "Gym and Home";

export type Equipment =
  | "Dumbbells"
  | "Barbells"
  | "Resistance Bands"
  | "Treadmill"
  | "Exercise Bike"
  | "Weight Machines"
  | "Kettlebells"
  | "Yoga Mat"
  | "Pull-up Bar"
  | "Other";

export type WorkoutPreference =
  | "Strength Training"
  | "Cardio"
  | "HIIT"
  | "Walking"
  | "Running"
  | "Cycling"
  | "Swimming"
  | "Yoga"
  | "Pilates"
  | "Weight Training"
  | "Functional Training"
  | "Sports";

export type WorkoutDaysPerWeek =
  | "1 day"
  | "2 days"
  | "3 days"
  | "4 days"
  | "5 days"
  | "6 days"
  | "7 days";

export type WorkoutDuration =
  | "15 minutes"
  | "30 minutes"
  | "45 minutes"
  | "60 minutes"
  | "75 minutes"
  | "90 minutes or more";

export type PreferredWorkoutTime =
  | "Early Morning"
  | "Morning"
  | "Afternoon"
  | "Evening"
  | "Night"
  | "Flexible";

export type WorkoutIntensity = "Low" | "Moderate" | "High";

export type Weekday =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type WorkType =
  | "Office"
  | "Work From Home"
  | "Hybrid"
  | "Physical Work"
  | "Student"
  | "Not Currently Working"
  | "Other";

export type StressLevel = "Low" | "Medium" | "High";

export type FreeTimeAvailability =
  | "Less than 15 minutes"
  | "15–30 minutes"
  | "30–45 minutes"
  | "45–60 minutes"
  | "More than 60 minutes"
  | "Flexible";

export type PreferredLanguage =
  | "English"
  | "Kannada"
  | "Hindi"
  | "Malayalam"
  | "Tamil"
  | "Telugu"
  | "Other";

export type CoachingStyle = "Friendly" | "Motivational" | "Strict" | "Balanced";

export type NotificationFrequency = "Daily" | "Weekly" | "None";

export const GENDER_OPTIONS: readonly Gender[] = [
  "Male",
  "Female",
  "Other",
  "Prefer not to say",
];

export const ACTIVITY_LEVEL_OPTIONS: readonly ActivityLevel[] = [
  "Sedentary",
  "Lightly active",
  "Moderately active",
  "Very active",
];

export const FITNESS_GOAL_OPTIONS: readonly FitnessGoalOption[] = [
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
];

export const BODY_COMPOSITION_SOURCE_OPTIONS: readonly BodyCompositionSource[] = [
  "Smart Scale",
  "Body Composition Analyzer",
  "Manual Measurement",
  "Other",
];

export const MEDICATION_FREQUENCY_OPTIONS: readonly MedicationFrequency[] = [
  "Once Daily",
  "Twice Daily",
  "Three Times Daily",
  "Four Times Daily",
  "Weekly",
  "As Needed",
  "Other",
];

export const ALLERGY_TYPE_OPTIONS: readonly AllergyType[] = [
  "Food",
  "Medicine",
  "Environmental",
  "Skin",
  "Other",
];

export const ALLERGY_SEVERITY_OPTIONS: readonly AllergySeverity[] = [
  "Mild",
  "Moderate",
  "Severe",
];

export const DIET_TYPE_OPTIONS: readonly DietType[] = [
  "Vegetarian",
  "Non-vegetarian",
  "Vegan",
  "Eggetarian",
];

export const PREFERRED_CUISINE_OPTIONS: readonly PreferredCuisine[] = [
  "South Indian",
  "North Indian",
  "Western",
  "Chinese",
  "Mediterranean",
  "Other",
];

export const FOOD_ALLERGEN_OPTIONS: readonly FoodAllergen[] = [
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Other",
];

export const FOOD_INTOLERANCE_OPTIONS: readonly FoodIntolerance[] = [
  "Lactose",
  "Gluten",
  "Fructose",
  "Other",
];

export const COOKING_PREFERENCE_OPTIONS: readonly CookingPreference[] = [
  "Home",
  "Outside",
  "Both",
];

export const MEALS_PER_DAY_OPTIONS: readonly MealsPerDay[] = [
  "2 meals",
  "3 meals",
  "4 meals",
  "5 meals",
  "6 or more meals",
];

export const FASTING_WINDOW_OPTIONS: readonly FastingWindow[] = [
  "12:12",
  "14:10",
  "16:8",
  "18:6",
  "Other",
];

export const INGREDIENT_OPTIONS: readonly Ingredient[] = [
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
];

export const FITNESS_LEVEL_OPTIONS: readonly FitnessLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

export const WORKOUT_EXPERIENCE_OPTIONS: readonly WorkoutExperienceOption[] = [
  "Never",
  "Less than 6 months",
  "6–12 months",
  "1–2 years",
  "More than 2 years",
];

export const WORKOUT_LOCATION_OPTIONS: readonly WorkoutLocation[] = [
  "Gym",
  "Home",
  "Outdoors",
  "Gym and Home",
];

export const EQUIPMENT_OPTIONS: readonly Equipment[] = [
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
];

export const WORKOUT_PREFERENCE_OPTIONS: readonly WorkoutPreference[] = [
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
];

export const WORKOUT_DAYS_PER_WEEK_OPTIONS: readonly WorkoutDaysPerWeek[] = [
  "1 day",
  "2 days",
  "3 days",
  "4 days",
  "5 days",
  "6 days",
  "7 days",
];

export const WORKOUT_DURATION_OPTIONS: readonly WorkoutDuration[] = [
  "15 minutes",
  "30 minutes",
  "45 minutes",
  "60 minutes",
  "75 minutes",
  "90 minutes or more",
];

export const PREFERRED_WORKOUT_TIME_OPTIONS: readonly PreferredWorkoutTime[] = [
  "Early Morning",
  "Morning",
  "Afternoon",
  "Evening",
  "Night",
  "Flexible",
];

export const WORKOUT_INTENSITY_OPTIONS: readonly WorkoutIntensity[] = [
  "Low",
  "Moderate",
  "High",
];

export const WEEKDAY_OPTIONS: readonly Weekday[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const WORK_TYPE_OPTIONS: readonly WorkType[] = [
  "Office",
  "Work From Home",
  "Hybrid",
  "Physical Work",
  "Student",
  "Not Currently Working",
  "Other",
];

export const STRESS_LEVEL_OPTIONS: readonly StressLevel[] = [
  "Low",
  "Medium",
  "High",
];

export const FREE_TIME_OPTIONS: readonly FreeTimeAvailability[] = [
  "Less than 15 minutes",
  "15–30 minutes",
  "30–45 minutes",
  "45–60 minutes",
  "More than 60 minutes",
  "Flexible",
];

export const PREFERRED_LANGUAGE_OPTIONS: readonly PreferredLanguage[] = [
  "English",
  "Kannada",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Telugu",
  "Other",
];

export const COACHING_STYLE_OPTIONS: readonly CoachingStyle[] = [
  "Friendly",
  "Motivational",
  "Strict",
  "Balanced",
];

export const NOTIFICATION_FREQUENCY_OPTIONS: readonly NotificationFrequency[] = [
  "Daily",
  "Weekly",
  "None",
];

export interface ProfileData {
  dateOfBirth: string | null;
  height: string;
  gender: Gender | "";
  occupation: string;
  country: string;
  activityLevel: ActivityLevel | "";
}

export interface FitnessGoalData {
  primaryGoal: FitnessGoalOption | "";
  secondaryGoal: FitnessGoalOption | "";
  currentWeight: string;
  targetWeight: string;
  targetBodyFatPercentage: string;
  targetMuscleMass: string;
  targetDate: string | null;
}

export interface BodyMeasurementsData {
  weight: string;
  neck: string;
  shoulder: string;
  chest: string;
  bust: string;
  waist: string;
  abdomen: string;
  hip: string;
  leftArm: string;
  rightArm: string;
  leftThigh: string;
  rightThigh: string;
  leftCalf: string;
  rightCalf: string;
  measuredAt: string | null;
  notes: string;
}

export interface BodyCompositionData {
  bodyFatPercentage: string;
  fatMass: string;
  muscleMass: string;
  skeletalMuscleMass: string;
  leanBodyMass: string;
  bodyWaterPercentage: string;
  totalBodyWater: string;
  visceralFat: string;
  boneMass: string;
  proteinPercentage: string;
  bmr: string;
  bmi: string;
  metabolicAge: string;
  source: BodyCompositionSource | "";
  measuredAt: string | null;
}

export interface MedicalCondition {
  id: string;
  conditionName: string;
  description: string;
  active: boolean;
  doctorAdvice: string;
  treatmentDetails: string;
  diagnosisDate: string | null;
  notes: string;
}

export interface Medication {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: MedicationFrequency | "";
  startDate: string | null;
  endDate: string | null;
  reasonForTaking: string;
  doctorPrescribed: boolean;
  notes: string;
}

export interface Allergy {
  id: string;
  allergyName: string;
  allergyType: AllergyType | "";
  severity: AllergySeverity | "";
  reaction: string;
  notes: string;
}

export interface FoodPreferences {
  dietType: DietType | "";
  preferredCuisines: PreferredCuisine[];
  foodAllergies: FoodAllergen[];
  otherFoodAllergy: string;
  foodIntolerances: FoodIntolerance[];
  otherFoodIntolerance: string;
  dislikedFoods: string[];
  favouriteFoods: string[];
  dailyFoodBudget: string;
  cookingPreference: CookingPreference | "";
  cookingTimeAvailable: string;
}

export interface EatingHabits {
  mealsPerDay: MealsPerDay | "";
  breakfastTime: string | null;
  lunchTime: string | null;
  dinnerTime: string | null;
  eatsSnacks: boolean;
  frequentlyEatsOutside: boolean;
  prefersHomemadeFood: boolean;
  followsIntermittentFasting: boolean;
  fastingWindow: FastingWindow | "";
}

export interface FoodAvailability {
  ingredients: Ingredient[];
  otherIngredients: string;
}

export interface WorkoutExperience {
  fitnessLevel: FitnessLevel | "";
  workoutExperience: WorkoutExperienceOption | "";
  workoutLocation: WorkoutLocation | "";
  gymMembership: boolean;
  availableEquipment: Equipment[];
  otherEquipment: string;
}

export interface WorkoutSchedule {
  workoutPreferences: WorkoutPreference[];
  workoutDaysPerWeek: WorkoutDaysPerWeek | "";
  workoutDuration: WorkoutDuration | "";
  preferredWorkoutTime: PreferredWorkoutTime | "";
  restDays: Weekday[];
  preferredIntensity: WorkoutIntensity | "";
}

export interface ExerciseRestrictions {
  currentInjuries: string;
  hasJointPain: boolean;
  exerciseRestrictions: string;
  dislikedExercises: string;
  doctorExerciseRestrictions: string;
}

export interface WorkLife {
  workType: WorkType | "";
  workStartTime: string | null;
  workEndTime: string | null;
  workingDays: Weekday[];
  dailySittingHours: string;
  dailyStandingHours: string;
  dailyCommuteMinutes: string;
  sleepTime: string | null;
  wakeUpTime: string | null;
  stressLevel: StressLevel | "";
  freeTimeForExercise: FreeTimeAvailability | "";
}

export interface Personalization {
  enableReminders: boolean;
  waterReminders: boolean;
  mealReminders: boolean;
  workoutReminders: boolean;
  preferredLanguage: PreferredLanguage | "";
  coachingStyle: CoachingStyle | "";
  notificationFrequency: NotificationFrequency | "";
  dataSharingConsent: boolean;
}

export interface OnboardingData {
  submissionId: string;
  profile: ProfileData;
  fitnessGoal: FitnessGoalData;
  bodyMeasurements: BodyMeasurementsData;
  bodyComposition: BodyCompositionData;
  medicalHistory: MedicalCondition[];
  medications: Medication[];
  allergies: Allergy[];
  foodPreferences: FoodPreferences;
  eatingHabits: EatingHabits;
  foodAvailability: FoodAvailability;
  workoutExperience: WorkoutExperience;
  workoutSchedule: WorkoutSchedule;
  exerciseRestrictions: ExerciseRestrictions;
  workLife: WorkLife;
  personalization: Personalization;
}

export type NumericBodyMeasurementField = Exclude<
  keyof BodyMeasurementsData,
  "measuredAt" | "notes"
>;

export type NumericBodyCompositionField = Exclude<
  keyof BodyCompositionData,
  "source" | "measuredAt"
>;

export interface MeasurementFieldMeta {
  key: NumericBodyMeasurementField;
  label: string;
  unit: string;
  group: "general" | "upper" | "waist" | "lower";
}

export interface CompositionFieldMeta {
  key: NumericBodyCompositionField;
  label: string;
  unit: string;
  validation: "positive" | "percentage";
  group: "fatMuscle" | "bodyWater" | "metabolic";
}

export const BODY_MEASUREMENT_FIELDS: readonly MeasurementFieldMeta[] = [
  { key: "weight", label: "Weight", unit: "kg", group: "general" },
  { key: "neck", label: "Neck", unit: "cm", group: "upper" },
  { key: "shoulder", label: "Shoulder", unit: "cm", group: "upper" },
  { key: "chest", label: "Chest", unit: "cm", group: "upper" },
  { key: "bust", label: "Bust", unit: "cm", group: "upper" },
  { key: "leftArm", label: "Left Arm", unit: "cm", group: "upper" },
  { key: "rightArm", label: "Right Arm", unit: "cm", group: "upper" },
  { key: "waist", label: "Waist", unit: "cm", group: "waist" },
  { key: "abdomen", label: "Abdomen", unit: "cm", group: "waist" },
  { key: "hip", label: "Hip", unit: "cm", group: "waist" },
  { key: "leftThigh", label: "Left Thigh", unit: "cm", group: "lower" },
  { key: "rightThigh", label: "Right Thigh", unit: "cm", group: "lower" },
  { key: "leftCalf", label: "Left Calf", unit: "cm", group: "lower" },
  { key: "rightCalf", label: "Right Calf", unit: "cm", group: "lower" },
];

export const BODY_COMPOSITION_FIELDS: readonly CompositionFieldMeta[] = [
  {
    key: "bodyFatPercentage",
    label: "Body Fat Percentage",
    unit: "%",
    validation: "percentage",
    group: "fatMuscle",
  },
  {
    key: "fatMass",
    label: "Fat Mass",
    unit: "kg",
    validation: "positive",
    group: "fatMuscle",
  },
  {
    key: "muscleMass",
    label: "Muscle Mass",
    unit: "kg",
    validation: "positive",
    group: "fatMuscle",
  },
  {
    key: "skeletalMuscleMass",
    label: "Skeletal Muscle Mass",
    unit: "kg",
    validation: "positive",
    group: "fatMuscle",
  },
  {
    key: "leanBodyMass",
    label: "Lean Body Mass",
    unit: "kg",
    validation: "positive",
    group: "fatMuscle",
  },
  {
    key: "boneMass",
    label: "Bone Mass",
    unit: "kg",
    validation: "positive",
    group: "fatMuscle",
  },
  {
    key: "bodyWaterPercentage",
    label: "Body Water Percentage",
    unit: "%",
    validation: "percentage",
    group: "bodyWater",
  },
  {
    key: "totalBodyWater",
    label: "Total Body Water",
    unit: "L",
    validation: "positive",
    group: "bodyWater",
  },
  {
    key: "visceralFat",
    label: "Visceral Fat",
    unit: "",
    validation: "positive",
    group: "metabolic",
  },
  {
    key: "proteinPercentage",
    label: "Protein Percentage",
    unit: "%",
    validation: "percentage",
    group: "metabolic",
  },
  {
    key: "bmr",
    label: "BMR",
    unit: "kcal",
    validation: "positive",
    group: "metabolic",
  },
  {
    key: "bmi",
    label: "BMI",
    unit: "",
    validation: "positive",
    group: "metabolic",
  },
  {
    key: "metabolicAge",
    label: "Metabolic Age",
    unit: "years",
    validation: "positive",
    group: "metabolic",
  },
];

export interface OnboardingStepDefinition {
  label: string;
  shortLabel: string;
  path: string;
}

export const ONBOARDING_STEPS: readonly OnboardingStepDefinition[] = [
  { label: "Profile", shortLabel: "Profile", path: "/profile" },
  { label: "Fitness Goal", shortLabel: "Goals", path: "/fitness-goal" },
  {
    label: "Body Measurements",
    shortLabel: "Measurements",
    path: "/body-measurements",
  },
  {
    label: "Body Composition",
    shortLabel: "Composition",
    path: "/body-composition",
  },
  {
    label: "Medical History",
    shortLabel: "Medical",
    path: "/medical-history",
  },
  { label: "Medications", shortLabel: "Medications", path: "/medications" },
  { label: "Allergies", shortLabel: "Allergies", path: "/allergies" },
  {
    label: "Food Preferences and Dietary Habits",
    shortLabel: "Food",
    path: "/food-preferences",
  },
  {
    label: "Workout and Fitness Preferences",
    shortLabel: "Workout",
    path: "/workout-preferences",
  },
  {
    label: "Work Life and Daily Routine",
    shortLabel: "Work Life",
    path: "/work-life",
  },
  {
    label: "Other Preferences and Personalization",
    shortLabel: "Personal",
    path: "/personalization",
  },
  { label: "Submit", shortLabel: "Submit", path: "/review" },
];

export const createOnboardingSubmissionId = (): string => crypto.randomUUID();

export const createInitialOnboardingData = (): OnboardingData => ({
  submissionId: createOnboardingSubmissionId(),
  profile: {
    dateOfBirth: null,
    height: "",
    gender: "",
    occupation: "",
    country: "",
    activityLevel: "",
  },
  fitnessGoal: {
    primaryGoal: "",
    secondaryGoal: "",
    currentWeight: "",
    targetWeight: "",
    targetBodyFatPercentage: "",
    targetMuscleMass: "",
    targetDate: null,
  },
  bodyMeasurements: {
    weight: "",
    neck: "",
    shoulder: "",
    chest: "",
    bust: "",
    waist: "",
    abdomen: "",
    hip: "",
    leftArm: "",
    rightArm: "",
    leftThigh: "",
    rightThigh: "",
    leftCalf: "",
    rightCalf: "",
    measuredAt: null,
    notes: "",
  },
  bodyComposition: {
    bodyFatPercentage: "",
    fatMass: "",
    muscleMass: "",
    skeletalMuscleMass: "",
    leanBodyMass: "",
    bodyWaterPercentage: "",
    totalBodyWater: "",
    visceralFat: "",
    boneMass: "",
    proteinPercentage: "",
    bmr: "",
    bmi: "",
    metabolicAge: "",
    source: "",
    measuredAt: null,
  },
  medicalHistory: [],
  medications: [],
  allergies: [],
  foodPreferences: {
    dietType: "",
    preferredCuisines: [],
    foodAllergies: [],
    otherFoodAllergy: "",
    foodIntolerances: [],
    otherFoodIntolerance: "",
    dislikedFoods: [],
    favouriteFoods: [],
    dailyFoodBudget: "",
    cookingPreference: "",
    cookingTimeAvailable: "",
  },
  eatingHabits: {
    mealsPerDay: "",
    breakfastTime: null,
    lunchTime: null,
    dinnerTime: null,
    eatsSnacks: false,
    frequentlyEatsOutside: false,
    prefersHomemadeFood: false,
    followsIntermittentFasting: false,
    fastingWindow: "",
  },
  foodAvailability: {
    ingredients: [],
    otherIngredients: "",
  },
  workoutExperience: {
    fitnessLevel: "",
    workoutExperience: "",
    workoutLocation: "",
    gymMembership: false,
    availableEquipment: [],
    otherEquipment: "",
  },
  workoutSchedule: {
    workoutPreferences: [],
    workoutDaysPerWeek: "",
    workoutDuration: "",
    preferredWorkoutTime: "",
    restDays: [],
    preferredIntensity: "",
  },
  exerciseRestrictions: {
    currentInjuries: "",
    hasJointPain: false,
    exerciseRestrictions: "",
    dislikedExercises: "",
    doctorExerciseRestrictions: "",
  },
  workLife: {
    workType: "",
    workStartTime: null,
    workEndTime: null,
    workingDays: [],
    dailySittingHours: "",
    dailyStandingHours: "",
    dailyCommuteMinutes: "",
    sleepTime: null,
    wakeUpTime: null,
    stressLevel: "",
    freeTimeForExercise: "",
  },
  personalization: {
    enableReminders: false,
    waterReminders: false,
    mealReminders: false,
    workoutReminders: false,
    preferredLanguage: "",
    coachingStyle: "",
    notificationFrequency: "",
    dataSharingConsent: false,
  },
});

export const createEmptyMedicalCondition = (id: string): MedicalCondition => ({
  id,
  conditionName: "",
  description: "",
  active: true,
  doctorAdvice: "",
  treatmentDetails: "",
  diagnosisDate: null,
  notes: "",
});

export const createEmptyMedication = (id: string): Medication => ({
  id,
  medicineName: "",
  dosage: "",
  frequency: "",
  startDate: null,
  endDate: null,
  reasonForTaking: "",
  doctorPrescribed: false,
  notes: "",
});

export const createEmptyAllergy = (id: string): Allergy => ({
  id,
  allergyName: "",
  allergyType: "",
  severity: "",
  reaction: "",
  notes: "",
});
