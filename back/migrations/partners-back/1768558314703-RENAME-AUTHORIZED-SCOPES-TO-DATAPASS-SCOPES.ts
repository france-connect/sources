import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1768558314703 implements MigrationInterface {
  name = 'Migration1768558314703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      RENAME COLUMN "authorizedScopes" TO "datapassScopes";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "partners_service_provider"
      RENAME COLUMN "datapassScopes" TO "authorizedScopes";
    `);
  }
}
