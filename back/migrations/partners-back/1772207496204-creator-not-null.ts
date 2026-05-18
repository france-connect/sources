import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorNotNull1772207496204 implements MigrationInterface {
  name = 'CreatorNotNull1772207496204';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "partners_service_provider_instance" WHERE "creatorId" IS NULL`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ALTER COLUMN "creatorId" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ALTER COLUMN "creatorId" DROP NOT NULL`,
    );
  }
}
