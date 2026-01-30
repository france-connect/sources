import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1764666700168 implements MigrationInterface {
  name = 'Migration1764666700168';
  allowedIdpHints = ['e1e90d50-cca0-4a85-9db3-0bcc190ee6f7'];
  allowedPrompts = ['login', 'consent'];
  serviceProviders = [
    // AMI
    '33fe498cc172fe691778912a2967baa650b24f1ae0ebbe47ae552f37b2d25ead',
    // AMI - RVO
    'fb9615294c746145edd857b4edbeb4996e316ae1712ed2bb361150a1e6cd8c6f',
    // Service-Public.fr - FranceConnect v2 - Qualification SP - Direction de l'information légale & administrative (DILA)
    '915ada81b4ecc468172b70bddf8789e264b94ec097855650b14db569a9977310',
    // Service-Public.fr - FranceConnect v2 - Preproduction SP - Direction de l'information légale & administrative (DILA)
    'b9e84b0a3cecf517fa1dfcfa278a993f358c6637f30a0ea05eaba3f0e75bd7fb',
    // PSL FC [low] sbx
    'e44ddbde26115b7b465ba6f672dffbf6c9aac8375c0694ac988a403db7934cb6',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Add DataPass fields to partners_service_provider_instance_version table
     * Add allowedIdpHints and allowedPrompts to the JSON data column
     * for the latest version (MAX createdAt) of each instance
     * where client_id matches one of the serviceProviders
     */

    // Build the JSON object to merge
    const newData = JSON.stringify({
      allowedIdpHints: this.allowedIdpHints,
      allowedPrompts: this.allowedPrompts,
    });

    // Update the JSON data by merging new properties with existing ones
    // Only update the latest version (MAX createdAt) for each instance
    // where client_id matches one of the serviceProviders
    // Note: ANY($2::text[]) handles ALL serviceProviders in the array automatically
    // No loop needed - PostgreSQL processes all array elements in a single query
    await queryRunner.query(
      `
      UPDATE "partners_service_provider_instance_version" AS v
      SET "data" = ("data"::jsonb || $1::jsonb)::json
      WHERE v.id IN (
        SELECT DISTINCT ON (v2."instanceId") v2.id
        FROM "partners_service_provider_instance_version" AS v2
        WHERE v2."data"->>'client_id' = ANY($2::text[])
        ORDER BY v2."instanceId", v2."createdAt" DESC
      );
    `,
      [newData, this.serviceProviders],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Remove DataPass fields from partners_service_provider_instance_version table
     * Remove allowedIdpHints and allowedPrompts from the JSON data column
     * for the latest version (MAX createdAt) of each instance
     * where client_id matches one of the serviceProviders
     */

    // Remove the properties from JSON using jsonb - operator
    await queryRunner.query(
      `
      UPDATE "partners_service_provider_instance_version" AS v
      SET "data" = ("data"::jsonb - 'allowedIdpHints' - 'allowedPrompts')::json
      WHERE v.id IN (
        SELECT DISTINCT ON (v2."instanceId") v2.id
        FROM "partners_service_provider_instance_version" AS v2
        WHERE v2."data"->>'client_id' = ANY($1::text[])
        ORDER BY v2."instanceId", v2."createdAt" DESC
      );
    `,
      [this.serviceProviders],
    );
  }
}
