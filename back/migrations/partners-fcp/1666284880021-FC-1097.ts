import { MigrationInterface, QueryRunner } from "typeorm";

export class FC10971666284880021 implements MigrationInterface {
    name = 'FC10971666284880021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."service_provider_configuration_environment_enum" AS ENUM('SANDBOX', 'PRODUCTION')`);
        await queryRunner.query(`CREATE TABLE "service_provider_configuration" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "environment" "public"."service_provider_configuration_environment_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "serviceProviderId" uuid NOT NULL, CONSTRAINT "PK_3d0e1a48a94b61c28a754cbd085" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_entity_enum" RENAME TO "account_permission_entity_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_entity_enum" AS ENUM('SERVICE_PROVIDER', 'IDENTITY_PROVIDER', 'SERVICE_PROVIDER_CONFIGURATION')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "entity" TYPE "public"."account_permission_entity_enum" USING "entity"::"text"::"public"."account_permission_entity_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_entity_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_permissiontype_enum" RENAME TO "account_permission_permissiontype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_permissiontype_enum" AS ENUM('SERVICE_PROVIDER_LIST', 'SERVICE_PROVIDER_VIEW', 'SERVICE_PROVIDER_EDIT', 'SERVICE_PROVIDER_CONFIGURATION_CREATE', 'SERVICE_PROVIDER_CONFIGURATION_LIST')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "permissionType" TYPE "public"."account_permission_permissiontype_enum" USING "permissionType"::"text"::"public"."account_permission_permissiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_permissiontype_enum_old"`);
        await queryRunner.query(`ALTER TABLE "service_provider_configuration" ADD CONSTRAINT "FK_d374538657983b76efb8caaadfa" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "service_provider_configuration" DROP CONSTRAINT "FK_d374538657983b76efb8caaadfa"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_permissiontype_enum_old" AS ENUM('SERVICE_PROVIDER_LIST', 'SERVICE_PROVIDER_VIEW', 'SERVICE_PROVIDER_EDIT')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "permissionType" TYPE "public"."account_permission_permissiontype_enum_old" USING "permissionType"::"text"::"public"."account_permission_permissiontype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_permissiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_permissiontype_enum_old" RENAME TO "account_permission_permissiontype_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_entity_enum_old" AS ENUM('SERVICE_PROVIDER', 'IDENTITY_PROVIDER')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "entity" TYPE "public"."account_permission_entity_enum_old" USING "entity"::"text"::"public"."account_permission_entity_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_entity_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_entity_enum_old" RENAME TO "account_permission_entity_enum"`);
        await queryRunner.query(`DROP TABLE "service_provider_configuration"`);
        await queryRunner.query(`DROP TYPE "public"."service_provider_configuration_environment_enum"`);
    }

}
