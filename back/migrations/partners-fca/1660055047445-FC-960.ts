import { MigrationInterface, QueryRunner } from "typeorm";

export class FC9601660055047445 implements MigrationInterface {
    name = 'FC9601660055047445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "account_service_provider" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "accountId" uuid NOT NULL, "serviceProviderId" uuid NOT NULL, CONSTRAINT "PK_001ea95e75721ccedc6db081b7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cd05c1c491ffac5dbd22b67478" ON "account_service_provider" ("accountId", "serviceProviderId") `);
        await queryRunner.query(`ALTER TABLE "account_service_provider" ADD CONSTRAINT "FK_19fb8cfe29e9f9692fbda879b92" FOREIGN KEY ("serviceProviderId") REFERENCES "service_provider"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "account_service_provider" ADD CONSTRAINT "FK_ead846c93c20ec2e63fde07fa87" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account_service_provider" DROP CONSTRAINT "FK_ead846c93c20ec2e63fde07fa87"`);
        await queryRunner.query(`ALTER TABLE "account_service_provider" DROP CONSTRAINT "FK_19fb8cfe29e9f9692fbda879b92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd05c1c491ffac5dbd22b67478"`);
        await queryRunner.query(`DROP TABLE "account_service_provider"`);
    }

}
