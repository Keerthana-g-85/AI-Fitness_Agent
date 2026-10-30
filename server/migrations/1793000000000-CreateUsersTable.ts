import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersTable1793000000000 implements MigrationInterface {
  name = "CreateUsersTable1793000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" character varying(255)`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "name" TYPE character varying(100)`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" TYPE character varying(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
