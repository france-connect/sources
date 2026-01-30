import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1766745946404 implements MigrationInterface {
  name = 'Migration1766745946404';

  // Service Provider data
  serviceProviderId = '25c4e41c-a97d-4bc9-8e05-e353c91eaef5';
  serviceProviderName = 'Service Provider Test';
  serviceProviderOrganizationName = 'Ministère de la Transition Écologique';
  serviceProviderDatapassRequestId = '99999';
  serviceProviderAuthorizedScopes = [
    'openid',
    'given_name',
    'family_name',
    'email',
    'gender',
    'birthdate',
    'birthplace',
    'birthcountry',
    'preferred_username',
  ];

  // Permission IDs
  listPermissionId = 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d';
  viewPermissionId = 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e';

  // Special value for NULL entityId (from partners-account-permission.entity.ts)
  NO_ENTITY_ID = '00000000-0000-0000-0000-000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Create a test SERVICE_PROVIDER for test@fia1.fr user
     */
    await queryRunner.query(
      `
      INSERT INTO "partners_service_provider"
        (id, name, "organizationName", "datapassRequestId", "authorizedScopes", "createdAt", "updatedAt")
      VALUES
        ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
    `,
      [
        this.serviceProviderId,
        this.serviceProviderName,
        this.serviceProviderOrganizationName,
        this.serviceProviderDatapassRequestId,
        JSON.stringify(this.serviceProviderAuthorizedScopes),
      ],
    );

    /**
     * Add LIST permission for SERVICE_PROVIDER entity to test@fia1.fr user
     * This allows access to /fournisseurs-de-service page
     * Uses email to find the account, works regardless of the account ID
     */
    await queryRunner.query(
      `
      INSERT INTO "partners_account_permission"
        (id, "permissionType", entity, "entityId", "accountId")
      SELECT
        $1,
        'LIST',
        'SERVICE_PROVIDER',
        $2,
        id
      FROM "partners_account"
      WHERE email = 'test@fia1.fr'
      ON CONFLICT ("accountId", "entityId", entity, "permissionType") DO NOTHING;
    `,
      [this.listPermissionId, this.NO_ENTITY_ID],
    );

    /**
     * Add VIEW permission for the test SERVICE_PROVIDER to test@fia1.fr user
     * This allows access to individual service provider details
     * Uses email to find the account, works regardless of the account ID
     */
    await queryRunner.query(
      `
      INSERT INTO "partners_account_permission"
        (id, "permissionType", entity, "entityId", "accountId")
      SELECT
        $1,
        'VIEW',
        'SERVICE_PROVIDER',
        $2,
        id
      FROM "partners_account"
      WHERE email = 'test@fia1.fr'
      ON CONFLICT ("accountId", "entityId", entity, "permissionType") DO NOTHING;
    `,
      [this.viewPermissionId, this.serviceProviderId],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Remove permissions for test@fia1.fr user
     */
    await queryRunner.query(
      `
      DELETE FROM "partners_account_permission"
      WHERE "accountId" IN (
        SELECT id FROM "partners_account" WHERE email = 'test@fia1.fr'
      )
      AND entity = 'SERVICE_PROVIDER';
    `
    );

    /**
     * Remove the test SERVICE_PROVIDER
     */
    await queryRunner.query(
      `
      DELETE FROM "partners_service_provider"
      WHERE id = $1;
    `,
      [this.serviceProviderId],
    );
  }
}
