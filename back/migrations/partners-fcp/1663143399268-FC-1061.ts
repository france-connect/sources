import { MigrationInterface, QueryRunner } from "typeorm";

export class FC10611663143399268 implements MigrationInterface {
    name = 'FC10611663143399268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_permission_entity_enum" AS ENUM('SERVICE_PROVIDER', 'IDENTITY_PROVIDER')`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_permissiontype_enum" AS ENUM('SP_OBSERVER_LIST', 'SP_INSTRUCTOR', 'SP_OWNER')`);
        await queryRunner.query(`CREATE TABLE "account_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "entityId" uuid, "entity" "public"."account_permission_entity_enum", "permissionType" "public"."account_permission_permissiontype_enum" NOT NULL, "accountId" uuid, CONSTRAINT "PK_202247292378cf3913a1edb41a0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account_permission" ADD CONSTRAINT "FK_67c76018a72dcddb3320388a442" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_permission" DROP CONSTRAINT "FK_67c76018a72dcddb3320388a442"`);
        await queryRunner.query(`DROP TABLE "account_permission"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_permissiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_entity_enum"`);
    }

}
