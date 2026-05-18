import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicServiceProviders1771259227282 implements MigrationInterface {
  name = 'PublicServiceProviders1771259227282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "partners_service_provider_instance" 
      SET "serviceProviderId" = (
        SELECT "id" FROM "partners_service_provider" WHERE "name" = 'SP_DEFAULT_LOW'
      ) 
      WHERE "serviceProviderId" IS NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "partners_service_provider" WHERE "id" IN (SELECT "id" FROM "partners_service_provider" WHERE "name" = 'SP_DEFAULT_LOW')`,
    );

    await queryRunner.query(
      `UPDATE "partners_service_provider_instance" SET "serviceProviderId" = NULL WHERE "serviceProviderId" = (
        SELECT "id" FROM "partners_service_provider" WHERE "name" = 'SP_DEFAULT_LOW'
      )`,
    );
  }
}
