import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpContributorPermission1775554506198 implements MigrationInterface {
  name = 'SpContributorPermission1775554506198';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "partners_account_permission" SET "permissionType" = 'SP_CONTRIBUTOR' WHERE "permissionType" = 'SP_ADMIN' AND "entity" = 'SERVICE_PROVIDER' AND "entityId" ='00000000-0000-0000-0000-000000000000'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `UPDATE "partners_account_permission" SET "permissionType" = 'SP_ADMIN' WHERE "permissionType" = 'SP_CONTRIBUTOR' AND "entity" = 'SERVICE_PROVIDER' AND "entityId" ='00000000-0000-0000-0000-000000000000'`,
    );
  }
}
