import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrackingAndMeasurementHistory1793000003000
  implements MigrationInterface
{
  name = "AddTrackingAndMeasurementHistory1793000003000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "body_measurements"
      ADD COLUMN IF NOT EXISTS "height_cm" numeric(5,2),
      ADD COLUMN IF NOT EXISTS "source" character varying(80)
    `);

    await queryRunner.query(`
      ALTER TABLE "body_compositions"
      ADD COLUMN IF NOT EXISTS "body_measurement_id" uuid
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint
          WHERE conname = 'FK_body_compositions_body_measurement'
        ) THEN
          ALTER TABLE "body_compositions"
          ADD CONSTRAINT "FK_body_compositions_body_measurement"
          FOREIGN KEY ("body_measurement_id") REFERENCES "body_measurements"("id")
          ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_body_compositions_body_measurement_id"
      ON "body_compositions" ("body_measurement_id")
      WHERE "body_measurement_id" IS NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "workout_preferences"
      ADD COLUMN IF NOT EXISTS "preferred_sports" jsonb NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(`
      ALTER TABLE "personalization"
      ADD COLUMN IF NOT EXISTS "daily_water_target_ml" integer,
      ADD COLUMN IF NOT EXISTS "sleep_goal_minutes" integer
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "food_intakes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "food_name" character varying(200) NOT NULL,
        "meal_type" character varying(30) NOT NULL,
        "serving_size" character varying(100),
        "calories" numeric(7,2) NOT NULL,
        "protein_g" numeric(7,2),
        "carbs_g" numeric(7,2),
        "fat_g" numeric(7,2),
        "fiber_g" numeric(7,2),
        "consumed_on" date NOT NULL,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_food_intakes_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_food_intakes_calories" CHECK ("calories" >= 0),
        CONSTRAINT "CHK_food_intakes_macros" CHECK (
          ("protein_g" IS NULL OR "protein_g" >= 0) AND
          ("carbs_g" IS NULL OR "carbs_g" >= 0) AND
          ("fat_g" IS NULL OR "fat_g" >= 0) AND
          ("fiber_g" IS NULL OR "fiber_g" >= 0)
        ),
        CONSTRAINT "FK_food_intakes_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_food_intakes_user_date" ON "food_intakes" ("user_id", "consumed_on")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "water_intakes" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "amount_ml" integer NOT NULL,
        "consumed_on" date NOT NULL,
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_water_intakes_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_water_intakes_amount" CHECK ("amount_ml" > 0 AND "amount_ml" <= 10000),
        CONSTRAINT "FK_water_intakes_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_water_intakes_user_date" ON "water_intakes" ("user_id", "consumed_on")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "workout_sessions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "name" character varying(150) NOT NULL,
        "workout_type" character varying(30) NOT NULL,
        "performed_on" date NOT NULL,
        "duration_minutes" integer NOT NULL,
        "calories_burned" integer,
        "intensity" character varying(30),
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workout_sessions_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_workout_sessions_duration" CHECK ("duration_minutes" > 0 AND "duration_minutes" <= 1440),
        CONSTRAINT "CHK_workout_sessions_calories" CHECK ("calories_burned" IS NULL OR "calories_burned" >= 0),
        CONSTRAINT "FK_workout_sessions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workout_sessions_user_date" ON "workout_sessions" ("user_id", "performed_on")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "workout_exercises" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "workout_session_id" uuid NOT NULL,
        "exercise_name" character varying(150) NOT NULL,
        "sets" integer,
        "reps" integer,
        "weight_kg" numeric(6,2),
        "duration_minutes" integer,
        "distance_km" numeric(7,2),
        "calories_burned" integer,
        "order_index" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workout_exercises_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_workout_exercises_values" CHECK (
          ("sets" IS NULL OR "sets" > 0) AND
          ("reps" IS NULL OR "reps" > 0) AND
          ("weight_kg" IS NULL OR "weight_kg" >= 0) AND
          ("duration_minutes" IS NULL OR "duration_minutes" > 0) AND
          ("distance_km" IS NULL OR "distance_km" >= 0) AND
          ("calories_burned" IS NULL OR "calories_burned" >= 0)
        ),
        CONSTRAINT "FK_workout_exercises_session" FOREIGN KEY ("workout_session_id") REFERENCES "workout_sessions"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_workout_exercises_session_id" ON "workout_exercises" ("workout_session_id")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sleep_records" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "sleep_date" date NOT NULL,
        "bed_time" character varying(5),
        "wake_time" character varying(5),
        "duration_minutes" integer NOT NULL,
        "quality" character varying(30),
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sleep_records_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_sleep_records_duration" CHECK ("duration_minutes" > 0 AND "duration_minutes" <= 1440),
        CONSTRAINT "FK_sleep_records_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_sleep_records_user_date" ON "sleep_records" ("user_id", "sleep_date")`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "sports_activities" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" uuid NOT NULL,
        "sport_name" character varying(100) NOT NULL,
        "activity_date" date NOT NULL,
        "duration_minutes" integer NOT NULL,
        "intensity" character varying(30),
        "calories_burned" integer,
        "location" character varying(120),
        "notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sports_activities_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_sports_activities_duration" CHECK ("duration_minutes" > 0 AND "duration_minutes" <= 1440),
        CONSTRAINT "CHK_sports_activities_calories" CHECK ("calories_burned" IS NULL OR "calories_burned" >= 0),
        CONSTRAINT "FK_sports_activities_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_sports_activities_user_date" ON "sports_activities" ("user_id", "activity_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "sports_activities"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sleep_records"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workout_exercises"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "workout_sessions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "water_intakes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "food_intakes"`);

    await queryRunner.query(`ALTER TABLE "personalization" DROP COLUMN IF EXISTS "sleep_goal_minutes"`);
    await queryRunner.query(`ALTER TABLE "personalization" DROP COLUMN IF EXISTS "daily_water_target_ml"`);
    await queryRunner.query(`ALTER TABLE "workout_preferences" DROP COLUMN IF EXISTS "preferred_sports"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_body_compositions_body_measurement_id"`);
    await queryRunner.query(`ALTER TABLE "body_compositions" DROP CONSTRAINT IF EXISTS "FK_body_compositions_body_measurement"`);
    await queryRunner.query(`ALTER TABLE "body_compositions" DROP COLUMN IF EXISTS "body_measurement_id"`);
    await queryRunner.query(`ALTER TABLE "body_measurements" DROP COLUMN IF EXISTS "source"`);
    await queryRunner.query(`ALTER TABLE "body_measurements" DROP COLUMN IF EXISTS "height_cm"`);
  }
}
