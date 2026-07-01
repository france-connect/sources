import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountNullableFirstnameLastname1778579166683
  implements MigrationInterface
{
  name = 'AccountNullableFirstnameLastname1778579166683';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_account" ALTER COLUMN "firstname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_account" ALTER COLUMN "lastname" DROP NOT NULL`,
    );
    await queryRunner.query(
      `UPDATE "partners_account" SET "firstname" = NULL, "lastname" = NULL WHERE "firstname" = 'N/A' AND "lastname" = 'N/A'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "partners_account" SET "firstname" = 'N/A', "lastname" = 'N/A' WHERE "firstname" IS NULL AND "lastname" IS NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_account" ALTER COLUMN "lastname" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_account" ALTER COLUMN "firstname" SET NOT NULL`,
    );
  }
}
