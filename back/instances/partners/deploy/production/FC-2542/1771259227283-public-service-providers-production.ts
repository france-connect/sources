import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicServiceProvidersProduction1771259227283 implements MigrationInterface {
  name = 'PublicServiceProvidersProduction1771259227283';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "partners_service_provider" 
      ("id", "name", "datapassRequestId", "datapassScopes", "platformId", "organisationId", "createdAt", "updatedAt") 
      VALUES (
      '7b51b520-24db-4d70-bc89-bec37fb0c6ff'::uuid,
      'SP_DEFAULT_LOW', 
      '007',
      '["openid", "profile", "birth", "identite_pivot", "gender", "birthdate", "birthcountry", "birthplace", "given_name", "family_name", "email", "preferred_username", "idp_birthdate", "amr", "idp_id"]'::json, 
      (SELECT "id" FROM "partners_platform" WHERE "name" = 'FRANCE_CONNECT_LOW'), 
      null, 
      '2026-02-26T23:00:00.000Z', 
      '2026-02-26T23:00:00.000Z'
      )`);

    await queryRunner.query(`INSERT INTO "partners_service_provider" 
      ("id", "name", "datapassRequestId", "datapassScopes", "platformId", "organisationId", "createdAt", "updatedAt") 
      VALUES (
      'b61c13e0-531a-4a82-9a75-26bf696fafa7'::uuid,
      'SP_DEFAULT_HIGH', 
      '117', 
      '["openid", "profile", "birth", "identite_pivot", "gender", "birthdate", "birthcountry", "birthplace", "given_name", "family_name", "email", "preferred_username", "rnipp_identite_pivot", "rnipp_gender", "rnipp_family_name", "rnipp_given_name", "rnipp_birthdate", "rnipp_birthplace", "rnipp_birthcountry", "rnipp_profile", "rnipp_birth", "amr"]'::json, 
      (SELECT "id" FROM "partners_platform" WHERE "name" = 'FRANCE_CONNECT_HIGH'), 
      null, 
      '2026-02-26T23:00:00.000Z', 
      '2026-02-26T23:00:00.000Z'
      )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "partners_service_provider" WHERE "id" IN ('7b51b520-24db-4d70-bc89-bec37fb0c6ff'::uuid, 'b61c13e0-531a-4a82-9a75-26bf696fafa7'::uuid)`,
    );
  }
}
