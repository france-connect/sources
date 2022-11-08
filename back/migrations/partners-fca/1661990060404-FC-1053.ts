import { MigrationInterface, QueryRunner } from "typeorm";

export class FC10531661990060404 implements MigrationInterface {
    name = 'FC10531661990060404'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_role_entity_enum" AS ENUM('SERVICE_PROVIDER', 'IDENTITY_PROVIDER')`);
        await queryRunner.query(`CREATE TYPE "public"."account_role_role_enum" AS ENUM('SP_OBSERVER_LIST', 'SP_INSTRUCTOR', 'SP_OWNER')`);
        await queryRunner.query(`CREATE TABLE "account_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityId" uuid, "entity" "public"."account_role_entity_enum", "role" "public"."account_role_role_enum" NOT NULL, "accountId" uuid, CONSTRAINT "PK_d3890c96feefc95c7cfd788cfda" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_role" ADD CONSTRAINT "FK_28abfa0f6e6e035cecc6ad8df6a" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_role" DROP CONSTRAINT "FK_28abfa0f6e6e035cecc6ad8df6a"`);
        await queryRunner.query(`DROP TABLE "account_role"`);
        await queryRunner.query(`DROP TYPE "public"."account_role_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_role_entity_enum"`);
    }

}
