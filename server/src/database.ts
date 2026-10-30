import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import Allergy from "./Model/Allergy";
import BodyComposition from "./Model/BodyComposition";
import BodyMeasurement from "./Model/BodyMeasurement";
import DataSharingConsent from "./Model/DataSharingConsent";
import EatingHabit from "./Model/EatingHabit";
import ExerciseRestriction from "./Model/ExerciseRestriction";
import FitnessGoal from "./Model/FitnessGoal";
import FoodAvailability from "./Model/FoodAvailability";
import FoodPreference from "./Model/FoodPreference";
import MedicalHistory from "./Model/MedicalHistory";
import Medication from "./Model/Medication";
import OnboardingSubmission from "./Model/OnboardingSubmission";
import Personalization from "./Model/Personalization";
import User from "./Model/User";
import UserProfile from "./Model/UserProfile";
import WorkLife from "./Model/WorkLife";
import WorkoutPreference from "./Model/WorkoutPreference";
import WorkoutSchedule from "./Model/WorkoutSchedule";

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const database = new DataSource({
  type: "postgres",
  username: getRequiredEnv("DB_USER"),
  host: getRequiredEnv("DB_HOST"),
  database: getRequiredEnv("DB_NAME"),
  password: getRequiredEnv("DB_PASSWORD"),
  port: Number(process.env.DB_PORT),
  synchronize: false,
  entities: [
    Allergy,
    BodyComposition,
    BodyMeasurement,
    DataSharingConsent,
    EatingHabit,
    ExerciseRestriction,
    FitnessGoal,
    FoodAvailability,
    FoodPreference,
    MedicalHistory,
    Medication,
    OnboardingSubmission,
    Personalization,
    User,
    UserProfile,
    WorkLife,
    WorkoutPreference,
    WorkoutSchedule,
  ],
  migrations: ["./migrations/*.ts"],
});

export const connection = async (): Promise<void> => {
  if (database.isInitialized) {
    return;
  }

  try {
    await database.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};
