import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1734520988428 implements MigrationInterface {
  name = 'Migrations1734520988428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Create the function that ensures only one version is published at a time
     */
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION ensure_single_published()
      RETURNS TRIGGER AS $$
      BEGIN
          IF NEW."publicationStatus" = 'PUBLISHED' THEN
          UPDATE "partners_service_provider_instance_version"
          SET "publicationStatus" = 'ARCHIVED'
          WHERE "instanceId" = NEW."instanceId"
              AND "id" <> NEW."id"
              AND "publicationStatus" = 'PUBLISHED';
          END IF;
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    /**
     * Create the trigger that calls the function
     */
    await queryRunner.query(`
      CREATE TRIGGER "tg_single_published"
      BEFORE UPDATE OF "publicationStatus" ON "partners_service_provider_instance_version"
      FOR EACH ROW
      WHEN (OLD."publicationStatus" IS DISTINCT FROM NEW."publicationStatus")
      EXECUTE FUNCTION ensure_single_published();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Remove trigger
     */
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS "tg_single_published" ON "partners_service_provider_instance_version";`,
    );

    /**
     * Remove function
     */
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS ensure_single_published();`,
    );
  }
}
