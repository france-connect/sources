import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1734520988427 implements MigrationInterface {
    name = 'Migrations1734520988427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partners_organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_811562b8b7f6e91891e17c36906" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "partners_platform" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "UQ_54a4d9273f48f650fdd1f4af9ef" UNIQUE ("name"), CONSTRAINT "PK_c880748d93504720b995f1ab82f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "partners_service_provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "platformId" uuid, "organisationId" uuid, CONSTRAINT "PK_1095af4f0e1acd71db672a69200" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."partners_service_provider_instance_version_publicationstatus_enum" AS ENUM('DRAFT', 'PENDING', 'PUBLISHED', 'ARCHIVED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "partners_service_provider_instance_version" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "publicationStatus" "public"."partners_service_provider_instance_version_publicationstatus_enum" NOT NULL DEFAULT 'DRAFT', "data" json NOT NULL DEFAULT '{}', "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), "instanceId" uuid NOT NULL, CONSTRAINT "PK_37da5fb88529eb780b5fb421ff6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "version_unique_published" ON "partners_service_provider_instance_version" ("instanceId") WHERE "publicationStatus" = 'PUBLISHED'`);
        await queryRunner.query(`CREATE TYPE "public"."partners_service_provider_instance_environment_enum" AS ENUM('SANDBOX', 'PRODUCTION')`);
        await queryRunner.query(`CREATE TABLE "partners_service_provider_instance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "environment" "public"."partners_service_provider_instance_environment_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(), "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(), CONSTRAINT "PK_dea35a5e7b2fca169534896b135" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."partners_account_permission_entity_enum" AS ENUM('ORGANISATION', 'SERVICE_PROVIDER', 'SP_INSTANCE', 'SP_INSTANCE_VERSION')`);
        await queryRunner.query(`CREATE TYPE "public"."partners_account_permission_permissiontype_enum" AS ENUM('LIST', 'CREATE', 'EDIT', 'VIEW')`);
        await queryRunner.query(`CREATE TABLE "partners_account_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" uuid NOT NULL, "entityId" uuid NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000', "entity" "public"."partners_account_permission_entity_enum", "permissionType" "public"."partners_account_permission_permissiontype_enum" NOT NULL, CONSTRAINT "UQ_892fc2fd1a9d02447f1240c7d77" UNIQUE ("accountId", "entityId", "entity", "permissionType"), CONSTRAINT "PK_25fb48104dbca1818599f1cad17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "partners_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sub" text NOT NULL, "email" text NOT NULL, "firstname" text NOT NULL, "lastname" text NOT NULL, "siren" character(9), "lastConnection" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_36d9992afb60e3f1957dc3637c3" UNIQUE ("sub"), CONSTRAINT "UQ_34a99e0be01a3d99e364a442bc5" UNIQUE ("email"), CONSTRAINT "PK_214cfac1bcddb21b46983a19ff0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "partners_service_provider" ADD CONSTRAINT "FK_7b5edd788d8c7a065422e7747ed" FOREIGN KEY ("platformId") REFERENCES "partners_platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partners_service_provider" ADD CONSTRAINT "FK_665903a0eea717558d5d3edef9d" FOREIGN KEY ("organisationId") REFERENCES "partners_organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partners_service_provider_instance_version" ADD CONSTRAINT "FK_aa0b5c4f38594f2092508f635e8" FOREIGN KEY ("instanceId") REFERENCES "partners_service_provider_instance"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partners_account_permission" ADD CONSTRAINT "FK_ca1e2d73f7554fa95cf28866eb1" FOREIGN KEY ("accountId") REFERENCES "partners_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partners_account_permission" DROP CONSTRAINT "FK_ca1e2d73f7554fa95cf28866eb1"`);
        await queryRunner.query(`ALTER TABLE "partners_service_provider_instance_version" DROP CONSTRAINT "FK_aa0b5c4f38594f2092508f635e8"`);
        await queryRunner.query(`ALTER TABLE "partners_service_provider" DROP CONSTRAINT "FK_665903a0eea717558d5d3edef9d"`);
        await queryRunner.query(`ALTER TABLE "partners_service_provider" DROP CONSTRAINT "FK_7b5edd788d8c7a065422e7747ed"`);
        await queryRunner.query(`DROP TABLE "partners_account"`);
        await queryRunner.query(`DROP TABLE "partners_account_permission"`);
        await queryRunner.query(`DROP TYPE "public"."partners_account_permission_permissiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."partners_account_permission_entity_enum"`);
        await queryRunner.query(`DROP TABLE "partners_service_provider_instance"`);
        await queryRunner.query(`DROP TYPE "public"."partners_service_provider_instance_environment_enum"`);
        await queryRunner.query(`DROP INDEX "public"."version_unique_published"`);
        await queryRunner.query(`DROP TABLE "partners_service_provider_instance_version"`);
        await queryRunner.query(`DROP TYPE "public"."partners_service_provider_instance_version_publicationstatus_enum"`);
        await queryRunner.query(`DROP TABLE "partners_service_provider"`);
        await queryRunner.query(`DROP TABLE "partners_platform"`);
        await queryRunner.query(`DROP TABLE "partners_organisation"`);
    }

}
