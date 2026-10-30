import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertUsersIdToUuid1793000001000 implements MigrationInterface {
  name = "ConvertUsersIdToUuid1793000001000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'users'
            AND column_name = 'id'
            AND data_type <> 'uuid'
        ) THEN
          ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
          ALTER TABLE "users" ALTER COLUMN "id" TYPE uuid USING gen_random_uuid();
          DROP SEQUENCE IF EXISTS "users_id_seq";
        END IF;
      END $$;
    `);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "users_id_seq"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT`);
    await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "id_integer" integer`);
    await queryRunner.query(`UPDATE "users" SET "id_integer" = nextval('users_id_seq')`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "PK_users_id"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "id_integer" TO "id"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "id" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_users_id" PRIMARY KEY ("id")`);
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT nextval('users_id_seq')`,
    );
  }
}
