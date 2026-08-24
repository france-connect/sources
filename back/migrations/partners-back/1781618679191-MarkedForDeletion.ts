import { MigrationInterface, QueryRunner } from 'typeorm';

export class MarkedForDeletion1781618679191 implements MigrationInterface {
  name = 'MarkedForDeletion1781618679191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD "markedForDeletion" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP COLUMN "markedForDeletion"`,
    );
  }
}
