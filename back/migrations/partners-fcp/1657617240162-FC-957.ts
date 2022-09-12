import {MigrationInterface, QueryRunner} from "typeorm";

export class FC9571657617240162 implements MigrationInterface {
    name = 'FC9571657617240162'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "organisation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c725ae234ef1b74cce43d2d00c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "platform" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_b9b57ec16b9c2ac927aa62b8b3f" UNIQUE ("name"), CONSTRAINT "PK_c33d6abeebd214bd2850bfd6b8e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."service_provider_status_enum" AS ENUM('SANDBOX', 'REVIEW_REQUESTED', 'REVIEW_IN_PROGRESS', 'REVIEW_VALIDATED', 'REVIEW_REFUSED', 'REVIEW_WAITING_CLIENT_FEEDBACK', 'PRODUCTION_ACCESS_PENDING', 'PRODUCTION_READY', 'PRODUCTION_LIVE', 'ARCHIVED')`);
        await queryRunner.query(`CREATE TABLE "service_provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "status" "public"."service_provider_status_enum" NOT NULL DEFAULT 'SANDBOX', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "platformId" uuid, "organisationId" uuid, CONSTRAINT "PK_7610a92ca242cb29d96009caa19" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "datapass" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "remoteId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "serviceProviderId" uuid, CONSTRAINT "UQ_252ff8c79a000c1f1457b0644ab" UNIQUE ("remoteId"), CONSTRAINT "PK_e705c5168a56bfa76fb35609097" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "service_provider" ADD CONSTRAINT "FK_03afe68438b3c4b6c654cef5c27" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "service_provider" ADD CONSTRAINT "FK_4fa07bd346497e80b3e8623ea88" FOREIGN KEY ("organisationId") REFERENCES "organisation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "datapass" ADD CONSTRAINT "FK_4cf97384065469a1422bc9638df" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "datapass" DROP CONSTRAINT "FK_4cf97384065469a1422bc9638df"`);
        await queryRunner.query(`ALTER TABLE "service_provider" DROP CONSTRAINT "FK_4fa07bd346497e80b3e8623ea88"`);
        await queryRunner.query(`ALTER TABLE "service_provider" DROP CONSTRAINT "FK_03afe68438b3c4b6c654cef5c27"`);
        await queryRunner.query(`DROP TABLE "datapass"`);
        await queryRunner.query(`DROP TABLE "service_provider"`);
        await queryRunner.query(`DROP TYPE "public"."service_provider_status_enum"`);
        await queryRunner.query(`DROP TABLE "platform"`);
        await queryRunner.query(`DROP TABLE "organisation"`);
    }

}
