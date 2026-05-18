import { MigrationInterface, QueryRunner } from 'typeorm';

export class AccountPhone1775554506197 implements MigrationInterface {
  name = 'AccountPhone1775554506197';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "partners_account" ADD "phone" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_account" DROP COLUMN "phone"`,
    );
  }
}
