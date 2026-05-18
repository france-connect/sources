import { MigrationInterface, QueryRunner } from 'typeorm';

export class OrganizationUs1774885161264 implements MigrationInterface {
  name = 'OrganizationUs1774885161264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" RENAME COLUMN "organisationId" TO "organizationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_organisation" RENAME TO "partners_organization"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_organization" RENAME TO "partners_organisation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider" RENAME COLUMN "organizationId" TO "organisationId"`,
    );
  }
}
