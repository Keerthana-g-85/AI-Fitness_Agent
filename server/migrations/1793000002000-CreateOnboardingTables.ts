import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOnboardingTables1793000002000 implements MigrationInterface {
  name = "CreateOnboardingTables1793000002000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "onboarding_completed_at" timestamptz
    `);

    await queryRunner.query(`
      ALTER TABLE "users"
      ADD CONSTRAINT "CHK_users_onboarding_completed_at"
      CHECK (("onboarding_completed" = false AND "onboarding_completed_at" IS NULL) OR ("onboarding_completed" = true AND "onboarding_completed_at" IS NOT NULL))
      NOT VALID
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user_profiles" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "date_of_birth" date NOT NULL,
        "height_cm" numeric(5,2) NOT NULL,
        "gender" character varying(30) NOT NULL,
        "occupation" character varying(150),
        "country" character varying(120) NOT NULL,
        "activity_level" character varying(50) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_user_profiles_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_user_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "CHK_user_profiles_height" CHECK ("height_cm" > 0),
        CONSTRAINT "FK_user_profiles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_user_profiles_user_id" ON "user_profiles" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "fitness_goals" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "primary_goal" character varying(80) NOT NULL,
        "secondary_goal" character varying(80),
        "current_weight_kg" numeric(6,2) NOT NULL,
        "target_weight_kg" numeric(6,2),
        "target_body_fat_percentage" numeric(5,2),
        "target_muscle_mass_kg" numeric(6,2),
        "target_date" date,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_fitness_goals_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_fitness_goals_current_weight" CHECK ("current_weight_kg" > 0),
        CONSTRAINT "CHK_fitness_goals_target_weight" CHECK ("target_weight_kg" IS NULL OR "target_weight_kg" > 0),
        CONSTRAINT "CHK_fitness_goals_target_body_fat" CHECK ("target_body_fat_percentage" IS NULL OR ("target_body_fat_percentage" >= 0 AND "target_body_fat_percentage" <= 100)),
        CONSTRAINT "CHK_fitness_goals_target_muscle" CHECK ("target_muscle_mass_kg" IS NULL OR "target_muscle_mass_kg" > 0),
        CONSTRAINT "FK_fitness_goals_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_fitness_goals_user_id" ON "fitness_goals" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "body_measurements" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "weight_kg" numeric(6,2),
        "neck_cm" numeric(5,2),
        "shoulder_cm" numeric(5,2),
        "chest_cm" numeric(5,2),
        "bust_cm" numeric(5,2),
        "waist_cm" numeric(5,2),
        "abdomen_cm" numeric(5,2),
        "hip_cm" numeric(5,2),
        "left_arm_cm" numeric(5,2),
        "right_arm_cm" numeric(5,2),
        "left_thigh_cm" numeric(5,2),
        "right_thigh_cm" numeric(5,2),
        "left_calf_cm" numeric(5,2),
        "right_calf_cm" numeric(5,2),
        "measured_at" date,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_body_measurements_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_body_measurements_positive" CHECK (
          ("weight_kg" IS NULL OR "weight_kg" > 0) AND
          ("neck_cm" IS NULL OR "neck_cm" > 0) AND
          ("shoulder_cm" IS NULL OR "shoulder_cm" > 0) AND
          ("chest_cm" IS NULL OR "chest_cm" > 0) AND
          ("bust_cm" IS NULL OR "bust_cm" > 0) AND
          ("waist_cm" IS NULL OR "waist_cm" > 0) AND
          ("abdomen_cm" IS NULL OR "abdomen_cm" > 0) AND
          ("hip_cm" IS NULL OR "hip_cm" > 0) AND
          ("left_arm_cm" IS NULL OR "left_arm_cm" > 0) AND
          ("right_arm_cm" IS NULL OR "right_arm_cm" > 0) AND
          ("left_thigh_cm" IS NULL OR "left_thigh_cm" > 0) AND
          ("right_thigh_cm" IS NULL OR "right_thigh_cm" > 0) AND
          ("left_calf_cm" IS NULL OR "left_calf_cm" > 0) AND
          ("right_calf_cm" IS NULL OR "right_calf_cm" > 0)
        ),
        CONSTRAINT "FK_body_measurements_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_body_measurements_user_id" ON "body_measurements" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "body_compositions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "body_fat_percentage" numeric(5,2),
        "fat_mass_kg" numeric(6,2),
        "muscle_mass_kg" numeric(6,2),
        "skeletal_muscle_mass_kg" numeric(6,2),
        "lean_body_mass_kg" numeric(6,2),
        "body_water_percentage" numeric(5,2),
        "total_body_water_liters" numeric(6,2),
        "visceral_fat" integer,
        "bone_mass_kg" numeric(5,2),
        "protein_percentage" numeric(5,2),
        "bmr_kcal" integer,
        "bmi" numeric(5,2),
        "metabolic_age" integer,
        "source" character varying(80),
        "measured_at" date,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_body_compositions_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_body_compositions_percentages" CHECK (
          ("body_fat_percentage" IS NULL OR ("body_fat_percentage" >= 0 AND "body_fat_percentage" <= 100)) AND
          ("body_water_percentage" IS NULL OR ("body_water_percentage" >= 0 AND "body_water_percentage" <= 100)) AND
          ("protein_percentage" IS NULL OR ("protein_percentage" >= 0 AND "protein_percentage" <= 100))
        ),
        CONSTRAINT "CHK_body_compositions_positive" CHECK (
          ("fat_mass_kg" IS NULL OR "fat_mass_kg" > 0) AND
          ("muscle_mass_kg" IS NULL OR "muscle_mass_kg" > 0) AND
          ("skeletal_muscle_mass_kg" IS NULL OR "skeletal_muscle_mass_kg" > 0) AND
          ("lean_body_mass_kg" IS NULL OR "lean_body_mass_kg" > 0) AND
          ("total_body_water_liters" IS NULL OR "total_body_water_liters" > 0) AND
          ("visceral_fat" IS NULL OR "visceral_fat" > 0) AND
          ("bone_mass_kg" IS NULL OR "bone_mass_kg" > 0) AND
          ("bmr_kcal" IS NULL OR "bmr_kcal" > 0) AND
          ("bmi" IS NULL OR "bmi" > 0) AND
          ("metabolic_age" IS NULL OR "metabolic_age" > 0)
        ),
        CONSTRAINT "FK_body_compositions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_body_compositions_user_id" ON "body_compositions" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medical_histories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "condition_name" character varying(200) NOT NULL,
        "description" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "doctor_advice" text,
        "treatment_details" text,
        "diagnosis_date" date,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_medical_histories_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_medical_histories_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_medical_histories_user_id" ON "medical_histories" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "medications" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "medicine_name" character varying(200) NOT NULL,
        "dosage" character varying(150),
        "frequency" character varying(50),
        "start_date" date,
        "end_date" date,
        "reason_for_taking" text,
        "doctor_prescribed" boolean NOT NULL DEFAULT false,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_medications_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_medications_date_range" CHECK ("start_date" IS NULL OR "end_date" IS NULL OR "end_date" >= "start_date"),
        CONSTRAINT "FK_medications_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_medications_user_id" ON "medications" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "allergies" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "allergy_name" character varying(200) NOT NULL,
        "allergy_type" character varying(50),
        "severity" character varying(30),
        "reaction" text,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_allergies_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_allergies_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_allergies_user_id" ON "allergies" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "food_preferences" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "diet_type" character varying(50) NOT NULL,
        "preferred_cuisine" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "food_allergies" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "other_food_allergy" text,
        "food_intolerances" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "other_food_intolerance" text,
        "disliked_foods" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "favourite_foods" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "daily_food_budget" numeric(10,2),
        "cooking_preference" character varying(30) NOT NULL,
        "cooking_time" integer,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_food_preferences_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_food_preferences_user_id" UNIQUE ("user_id"),
        CONSTRAINT "CHK_food_preferences_budget" CHECK ("daily_food_budget" IS NULL OR "daily_food_budget" >= 0),
        CONSTRAINT "CHK_food_preferences_cooking_time" CHECK ("cooking_time" IS NULL OR "cooking_time" > 0),
        CONSTRAINT "FK_food_preferences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_food_preferences_user_id" ON "food_preferences" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "eating_habits" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "meals_per_day" character varying(30) NOT NULL,
        "breakfast_time" time,
        "lunch_time" time,
        "dinner_time" time,
        "eats_snacks" boolean NOT NULL DEFAULT false,
        "frequently_eats_outside" boolean NOT NULL DEFAULT false,
        "prefers_homemade_food" boolean NOT NULL DEFAULT false,
        "follows_intermittent_fasting" boolean NOT NULL DEFAULT false,
        "fasting_window" character varying(20),
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_eating_habits_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_eating_habits_user_id" UNIQUE ("user_id"),
        CONSTRAINT "CHK_eating_habits_fasting_window" CHECK ("follows_intermittent_fasting" = false OR "fasting_window" IS NOT NULL),
        CONSTRAINT "FK_eating_habits_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_eating_habits_user_id" ON "eating_habits" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "food_availability" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "available_ingredients" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "other_ingredients" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_food_availability_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_food_availability_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_food_availability_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_food_availability_user_id" ON "food_availability" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "workout_preferences" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "fitness_level" character varying(30) NOT NULL,
        "workout_experience" character varying(50) NOT NULL,
        "workout_location" character varying(50) NOT NULL,
        "gym_membership" boolean NOT NULL DEFAULT false,
        "available_equipment" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "other_equipment" text,
        "preferred_workouts" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workout_preferences_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_workout_preferences_user_id" UNIQUE ("user_id"),
        CONSTRAINT "CHK_workout_preferences_workouts" CHECK (jsonb_array_length("preferred_workouts") > 0),
        CONSTRAINT "FK_workout_preferences_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workout_preferences_user_id" ON "workout_preferences" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "workout_schedules" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "workout_days_per_week" integer NOT NULL,
        "workout_duration" character varying(40) NOT NULL,
        "preferred_workout_time" character varying(30) NOT NULL,
        "rest_days" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "preferred_intensity" character varying(30) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workout_schedules_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_workout_schedules_user_id" UNIQUE ("user_id"),
        CONSTRAINT "CHK_workout_schedules_days" CHECK ("workout_days_per_week" BETWEEN 1 AND 7),
        CONSTRAINT "CHK_workout_schedules_rest_days" CHECK (jsonb_array_length("rest_days") <= 7 - "workout_days_per_week"),
        CONSTRAINT "FK_workout_schedules_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workout_schedules_user_id" ON "workout_schedules" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "exercise_restrictions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "current_injuries" text,
        "experiences_joint_pain" boolean NOT NULL DEFAULT false,
        "restricted_exercises" text,
        "disliked_exercises" text,
        "doctor_exercise_restrictions" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_exercise_restrictions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_exercise_restrictions_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_exercise_restrictions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_exercise_restrictions_user_id" ON "exercise_restrictions" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "work_life" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "work_type" character varying(80) NOT NULL,
        "work_start_time" time,
        "work_end_time" time,
        "working_days" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "daily_sitting_hours" numeric(4,2),
        "daily_standing_hours" numeric(4,2),
        "daily_commute_time" integer,
        "sleep_time" time NOT NULL,
        "wake_up_time" time NOT NULL,
        "stress_level" character varying(30),
        "free_time" character varying(50) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_work_life_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_work_life_user_id" UNIQUE ("user_id"),
        CONSTRAINT "CHK_work_life_non_negative" CHECK (
          ("daily_sitting_hours" IS NULL OR "daily_sitting_hours" >= 0) AND
          ("daily_standing_hours" IS NULL OR "daily_standing_hours" >= 0) AND
          ("daily_commute_time" IS NULL OR "daily_commute_time" >= 0)
        ),
        CONSTRAINT "FK_work_life_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_work_life_user_id" ON "work_life" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "personalization" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "reminder_preference" boolean NOT NULL DEFAULT false,
        "water_reminder" boolean NOT NULL DEFAULT false,
        "meal_reminder" boolean NOT NULL DEFAULT false,
        "workout_reminder" boolean NOT NULL DEFAULT false,
        "preferred_language" character varying(50) NOT NULL,
        "coaching_style" character varying(50) NOT NULL,
        "notification_frequency" character varying(30) NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_personalization_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_personalization_user_id" UNIQUE ("user_id"),
        CONSTRAINT "FK_personalization_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_personalization_user_id" ON "personalization" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "data_sharing_consents" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "consent_given" boolean NOT NULL,
        "consent_version" character varying(50) NOT NULL,
        "consented_at" timestamptz NOT NULL,
        "withdrawn_at" timestamptz,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_data_sharing_consents_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_data_sharing_consents_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_data_sharing_consents_user_id" ON "data_sharing_consents" ("user_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "onboarding_submissions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "submission_id" uuid NOT NULL,
        "completed_at" timestamptz NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_onboarding_submissions_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_onboarding_submissions_user_submission" UNIQUE ("user_id", "submission_id"),
        CONSTRAINT "FK_onboarding_submissions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_onboarding_submissions_user_id" ON "onboarding_submissions" ("user_id")`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_onboarding_submissions_submission_id" ON "onboarding_submissions" ("submission_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "onboarding_submissions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "data_sharing_consents"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "personalization"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "work_life"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "exercise_restrictions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workout_schedules"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workout_preferences"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "food_availability"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "eating_habits"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "food_preferences"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "allergies"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "medical_histories"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "body_compositions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "body_measurements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "fitness_goals"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "user_profiles"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "CHK_users_onboarding_completed_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "onboarding_completed_at"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "onboarding_completed"`);
  }
}
