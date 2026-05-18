import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatapassOrganisation1773678037337 implements MigrationInterface {
  name = 'DatapassOrganisation1773678037337';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Delete all organisations since there may only exists fixtures.
     */
    await queryRunner.query(`DELETE FROM "partners_organisation"`);

    await queryRunner.query(
      `ALTER TABLE "partners_organisation" ADD "siret" text NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" DROP COLUMN "organizationName"`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ADD "datapassAuthorizationId" text`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ADD "datapassEidasLevel" text`,
    );

    await queryRunner.query(
      `UPDATE "partners_service_provider" SET "datapassAuthorizationId" = "datapassRequestId" WHERE "datapassAuthorizationId" IS NULL`,
    );

    await queryRunner.query(
      `UPDATE "partners_service_provider" SET "datapassEidasLevel" = 'eidas_1' WHERE "datapassEidasLevel" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ALTER COLUMN "datapassRequestId" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ALTER COLUMN "datapassAuthorizationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ALTER COLUMN "datapassEidasLevel" SET NOT NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_organisation" ADD CONSTRAINT "UQ_56ed73d05d0c3ec350fcee957e1" UNIQUE ("siret")`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ADD CONSTRAINT "UQ_7b5edd788d8c7a065422e7747ed" UNIQUE ("datapassRequestId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" DROP CONSTRAINT "UQ_7b5edd788d8c7a065422e7747ed"`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" DROP COLUMN "datapassEidasLevel"`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" DROP COLUMN "datapassAuthorizationId"`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" ADD "organizationName" text`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_organisation" DROP COLUMN "siret"`,
    );
  }
}
