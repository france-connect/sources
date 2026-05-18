import { MigrationInterface, QueryRunner } from 'typeorm';

export class DefaultServiceProviderInstance1772615149335 implements MigrationInterface {
  name = 'DefaultServiceProviderInstance1772615149335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "partners_service_provider_instance"
      SET "serviceProviderId" = '7b51b520-24db-4d70-bc89-bec37fb0c6ff'::uuid
      WHERE "serviceProviderId" IS NULL
    `);
  }

  // This down migration is not strictly reversing the up migration,
  // as it will set to NULL all instances that have the default service provider ID,
  // even those that were not updated by this migration.
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "partners_service_provider_instance"
      SET "serviceProviderId" = NULL
      WHERE "serviceProviderId" = '7b51b520-24db-4d70-bc89-bec37fb0c6ff'::uuid
    `);
  }
}
