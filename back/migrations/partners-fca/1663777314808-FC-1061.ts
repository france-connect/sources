import { MigrationInterface, QueryRunner } from "typeorm";

export class FC10611663777314808 implements MigrationInterface {
    name = 'FC10611663777314808'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."account_permission_permissiontype_enum" RENAME TO "account_permission_permissiontype_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_permission_permissiontype_enum" AS ENUM('SERVICE_PROVIDER_LIST', 'SERVICE_PROVIDER_VIEW', 'SERVICE_PROVIDER_EDIT')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "permissionType" TYPE "public"."account_permission_permissiontype_enum" USING "permissionType"::"text"::"public"."account_permission_permissiontype_enum"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_permissiontype_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_permission_permissiontype_enum_old" AS ENUM('SP_OBSERVER_LIST', 'SP_INSTRUCTOR', 'SP_OWNER')`);
        await queryRunner.query(`ALTER TABLE "account_permission" ALTER COLUMN "permissionType" TYPE "public"."account_permission_permissiontype_enum_old" USING "permissionType"::"text"::"public"."account_permission_permissiontype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."account_permission_permissiontype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_permission_permissiontype_enum_old" RENAME TO "account_permission_permissiontype_enum"`);
    }

}
