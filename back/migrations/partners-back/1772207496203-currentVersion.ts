import { MigrationInterface, QueryRunner } from 'typeorm';

export class CurrentVersion1772207496203 implements MigrationInterface {
  name = 'CurrentVersion1772207496203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD "currentVersionId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD CONSTRAINT "UQ_ddf67c77e7759e428ff571990a2" UNIQUE ("currentVersionId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD CONSTRAINT "FK_ddf67c77e7759e428ff571990a2" FOREIGN KEY ("currentVersionId") REFERENCES "partners_service_provider_instance_version"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION update_current_version_id()
      RETURNS TRIGGER AS $$
      BEGIN
        UPDATE "partners_service_provider_instance" SET "currentVersionId" = NEW."id" WHERE "id" = NEW."instanceId";
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(`
      CREATE TRIGGER "tg_update_current_version_id"
      AFTER INSERT ON "partners_service_provider_instance_version"
      FOR EACH ROW
      EXECUTE FUNCTION update_current_version_id();
    `);

    await queryRunner.query(`
      UPDATE "partners_service_provider_instance" SET "currentVersionId" = (
        SELECT "id" FROM "partners_service_provider_instance_version" WHERE "instanceId" = "partners_service_provider_instance"."id" ORDER BY "createdAt" DESC LIMIT 1
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP CONSTRAINT "FK_ddf67c77e7759e428ff571990a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP CONSTRAINT "UQ_ddf67c77e7759e428ff571990a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP COLUMN "currentVersionId"`,
    );

    await queryRunner.query(`
      DROP TRIGGER IF EXISTS "tg_update_current_version_id" ON "partners_service_provider_instance_version";
    `);
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS update_current_version_id();
    `);
  }
}
