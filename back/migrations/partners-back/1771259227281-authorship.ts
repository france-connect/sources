import { MigrationInterface, QueryRunner } from 'typeorm';

export class Authorship1771259227281 implements MigrationInterface {
  name = 'Authorship1771259227281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD "creatorId" uuid`,
    );

    await queryRunner.query(
      `UPDATE "partners_service_provider_instance" "i"
       SET "creatorId" = (
        SELECT "accountId" FROM "partners_account_permission" "p"
         WHERE entity = 'SP_INSTANCE'
         AND p."entityId" IS NOT NULL
         AND p."permissionType" = 'INSTANCE_CONTRIBUTOR'
         AND i."id" = p."entityId"
         LIMIT 1
        )
        WHERE "creatorId" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD CONSTRAINT "FK_92c7f3eb335926a415f0e47c64f" FOREIGN KEY ("creatorId") REFERENCES "partners_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP CONSTRAINT "FK_92c7f3eb335926a415f0e47c64f"`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP COLUMN "creatorId"`,
    );
  }
}
