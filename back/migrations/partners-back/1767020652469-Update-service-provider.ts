import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1767020652469 implements MigrationInterface {
  name = 'Migration1767020652469';

  // Service Providers data
  serviceProviders = [
    {
      id: '25c4e41c-a97d-4bc9-8e05-e353c91eaef5',
      name: 'Service Provider 1',
      organizationName:
        'Ministère de l’Économie, des Finances et de la Souveraineté industrielle, énergétique et numérique',
      datapassRequestId: '99999',
      authorizedScopes: [
        'openid',
        'given_name',
        'family_name',
        'email',
        'gender',
        'birthdate',
        'birthplace',
        'birthcountry',
        'preferred_username',
      ],
    },
    {
      id: 'd7d36b81-0b68-4c26-a399-854848164f29',
      name: 'Service Provider 2',
      organizationName: 'Ministère de la Transition Écologique',
      datapassRequestId: '99997',
      authorizedScopes: [
        'openid',
        'given_name',
        'family_name',
        'email',
        'gender',
        'birthdate',
        'birthplace',
        'birthcountry',
        'preferred_username',
      ],
    },
    {
      id: 'b66afba8-58b2-4465-a868-6a187ea67f5a',
      name: 'Service Provider 3',
      organizationName: 'Ministère de la Justice',
      datapassRequestId: '99998',
      authorizedScopes: [
        'openid',
        'given_name',
        'family_name',
        'email',
        'birthdate',
      ],
    },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Update multiple SERVICE_PROVIDER records with new data
     * This migration updates existing SP records with corrected information
     */
    for (const sp of this.serviceProviders) {
      await queryRunner.query(
        `
        UPDATE "partners_service_provider"
        SET
          name = $2,
          "organizationName" = $3,
          "datapassRequestId" = $4,
          "authorizedScopes" = $5,
          "updatedAt" = NOW()
        WHERE id = $1;
      `,
        [
          sp.id,
          sp.name,
          sp.organizationName,
          sp.datapassRequestId,
          JSON.stringify(sp.authorizedScopes),
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Revert to previous values (if needed, otherwise do nothing)
     * Note: This assumes you want to keep the previous data structure
     * You might want to store the old values if you need exact rollback
     */
    await queryRunner.query(
      `
      -- No-op: Cannot restore previous values without storing them
      -- If rollback is critical, you should query and store old values in up()
      SELECT 1;
    `,
    );
  }
}
