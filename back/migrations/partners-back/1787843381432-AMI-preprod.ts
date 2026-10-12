import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1787843381432 implements MigrationInterface {
  name = 'Migration1787843381432';
  // FI AMI - Preprod
  allowedIdpHints = ['739be608-8b97-4c27-918a-13971a7251c5'];
  allowedPrompts = ['login', 'consent'];
  serviceProviders = [
    // FS AMI - Preprod
    'ebb5177a929823eb459dbf053972cb92ec6730ca926583b1fc0bf1853d901cba',
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
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
