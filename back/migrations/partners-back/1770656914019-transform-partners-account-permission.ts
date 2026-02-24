import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransformPartnersAccountPermission1770656914019 implements MigrationInterface {
  name = 'TransformPartnersAccountPermission1770656914019';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * 1. Change entity column from enum to text
     */
    await queryRunner.query(`
      ALTER TABLE "partners_account_permission"
      ALTER COLUMN "entity" TYPE text USING "entity"::text
    `);

    /**
     * 2. Change permissionType column from enum to text
     */
    await queryRunner.query(`
      ALTER TABLE "partners_account_permission"
      ALTER COLUMN "permissionType" TYPE text USING "permissionType"::text
    `);

    /**
     * 3. Drop the old enum types
     */
    await queryRunner.query(`
      DROP TYPE "public"."partners_account_permission_entity_enum"
    `);

    await queryRunner.query(`
      DROP TYPE "public"."partners_account_permission_permissiontype_enum"
    `);

    /**
     * 4. Transform LIST (entityId = NO_ENTITY_ID) with SP_INSTANCE to INSTANCE_CONTRIBUTOR
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'INSTANCE_CONTRIBUTOR'
      WHERE "permissionType" = 'LIST'
        AND "entity" = 'SP_INSTANCE'
        AND "entityId" = '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 5. Transform LIST (entityId = NO_ENTITY_ID) with SERVICE_PROVIDER to SP_ADMIN
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'SP_ADMIN'
      WHERE "permissionType" = 'LIST'
        AND "entity" = 'SERVICE_PROVIDER'
        AND "entityId" = '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 6. Transform VIEW (entityId != NO_ENTITY_ID) with SP_INSTANCE to INSTANCE_CONTRIBUTOR
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'INSTANCE_CONTRIBUTOR'
      WHERE "permissionType" = 'VIEW'
        AND "entity" = 'SP_INSTANCE'
        AND "entityId" != '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 7. Transform VIEW (entityId != NO_ENTITY_ID) with SERVICE_PROVIDER to SP_ADMIN
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'SP_ADMIN'
      WHERE "permissionType" = 'VIEW'
        AND "entity" = 'SERVICE_PROVIDER'
        AND "entityId" != '00000000-0000-0000-0000-000000000000'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * 1. Revert INSTANCE_CONTRIBUTOR with entityId = NO_ENTITY_ID back to LIST (while still text)
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'LIST'
      WHERE "permissionType" = 'INSTANCE_CONTRIBUTOR'
        AND "entity" = 'SP_INSTANCE'
        AND "entityId" = '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 2. Revert SP_ADMIN with entityId = NO_ENTITY_ID back to LIST (while still text)
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'LIST'
      WHERE "permissionType" = 'SP_ADMIN'
        AND "entity" = 'SERVICE_PROVIDER'
        AND "entityId" = '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 3. Revert INSTANCE_CONTRIBUTOR with entityId != NO_ENTITY_ID back to VIEW (while still text)
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'VIEW'
      WHERE "permissionType" = 'INSTANCE_CONTRIBUTOR'
        AND "entity" = 'SP_INSTANCE'
        AND "entityId" != '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 4. Revert SP_ADMIN with entityId != NO_ENTITY_ID back to VIEW (while still text)
     */
    await queryRunner.query(`
      UPDATE "partners_account_permission"
      SET "permissionType" = 'VIEW'
      WHERE "permissionType" = 'SP_ADMIN'
        AND "entity" = 'SERVICE_PROVIDER'
        AND "entityId" != '00000000-0000-0000-0000-000000000000'
    `);

    /**
     * 5. Create enum types
     */
    await queryRunner.query(`
      CREATE TYPE "public"."partners_account_permission_entity_enum" AS ENUM(
        'ORGANISATION', 'SERVICE_PROVIDER', 'SP_INSTANCE', 'SP_INSTANCE_VERSION'
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."partners_account_permission_permissiontype_enum" AS ENUM(
        'LIST', 'CREATE', 'EDIT', 'VIEW'
      )
    `);

    /**
     * 6. Change entity column back from text to enum
     */
    await queryRunner.query(`
      ALTER TABLE "partners_account_permission"
      ALTER COLUMN "entity" TYPE "public"."partners_account_permission_entity_enum"
      USING "entity"::"public"."partners_account_permission_entity_enum"
    `);

    /**
     * 7. Change permissionType column back from text to enum
     */
    await queryRunner.query(`
      ALTER TABLE "partners_account_permission"
      ALTER COLUMN "permissionType" TYPE "public"."partners_account_permission_permissiontype_enum"
      USING "permissionType"::"public"."partners_account_permission_permissiontype_enum"
    `);
  }
}
