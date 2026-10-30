import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import User from "./Model/User";

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
  entities: [User],
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
