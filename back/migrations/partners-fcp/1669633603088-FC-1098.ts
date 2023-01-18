import { MigrationInterface, QueryRunner } from "typeorm";

export class FC10981669633603088 implements MigrationInterface {
    name = 'FC10981669633603088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_provider" ADD "configurationNumberIncrement" smallint DEFAULT '0'`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_entity_enum" RENAME TO "account_permission_entity_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_entity_enum" AS ENUM('SERVICE_PROVIDER', 'IDENTITY_PROVIDER')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "entity" TYPE "public"."account_permission_entity_enum" USING "entity"::"text"::"public"."account_permission_entity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_entity_enum_old"`);
        await queryRunner.query(`ALTER TABLE "service_provider_configuration" ADD CONSTRAINT "UQ_59c96c3629043bc3f563635ec78" UNIQUE ("name", "serviceProviderId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_provider_configuration" DROP CONSTRAINT "UQ_59c96c3629043bc3f563635ec78"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_entity_enum_old" AS ENUM('SERVICE_PROVIDER', 'IDENTITY_PROVIDER', 'SERVICE_PROVIDER_CONFIGURATION')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "entity" TYPE "public"."account_permission_entity_enum_old" USING "entity"::"text"::"public"."account_permission_entity_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_entity_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_entity_enum_old" RENAME TO "account_permission_entity_enum"`);
        await queryRunner.query(`ALTER TABLE "service_provider" DROP COLUMN "configurationNumberIncrement"`);
    }

}
