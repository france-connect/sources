import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734520988429 implements MigrationInterface {
  name = 'Migration1734520988429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Add DataPass fields to partners_service_provider table
     */
    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      ADD COLUMN "organizationName" text;
    `);

    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      ADD COLUMN "datapassRequestId" text UNIQUE;
    `);

    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      ADD COLUMN "authorizedScopes" json;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Remove DataPass fields from partners_service_provider table
     */
    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      DROP COLUMN IF EXISTS "authorizedScopes";
    `);

    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      DROP COLUMN IF EXISTS "datapassRequestId";
    `);

    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      DROP COLUMN IF EXISTS "organizationName";
    `);
  }
}
