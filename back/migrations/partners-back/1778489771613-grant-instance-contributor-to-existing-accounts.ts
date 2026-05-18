import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrantInstanceContributorToExistingAccounts1778489771613 implements MigrationInterface {
  name = 'GrantInstanceContributorToExistingAccounts1778489771613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "partners_account_permission"
        ("accountId", "entityId", "entity", "permissionType")
      SELECT
        a."id",
        '00000000-0000-0000-0000-000000000000',
        NULL,
        'INSTANCE_CONTRIBUTOR'
      FROM "partners_account" a
      WHERE NOT EXISTS (
        SELECT 1
        FROM "partners_account_permission" p
        WHERE p."accountId" = a."id"
          AND p."permissionType" = 'INSTANCE_CONTRIBUTOR'
          AND p."entity" IS NULL
          AND p."entityId" = '00000000-0000-0000-0000-000000000000'
      )
    `);

    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "entity" = NULL
      WHERE "permissionType" = 'INSTANCE_CONTRIBUTOR'
        AND "entity" = 'SP_INSTANCE'
        AND "entityId" = '00000000-0000-0000-0000-000000000000'
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // Intentionally empty: rolling back would revoke access already granted.
  }
}
