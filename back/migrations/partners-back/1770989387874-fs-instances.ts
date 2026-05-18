import { MigrationInterface, QueryRunner } from 'typeorm';

export class FsInstances1770989387874 implements MigrationInterface {
  name = 'FsInstances1770989387874';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD "serviceProviderId" uuid`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" ADD CONSTRAINT "FK_2f1e9e1225e12d34fbe776e0c87" FOREIGN KEY ("serviceProviderId") REFERENCES "partners_service_provider"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP CONSTRAINT "FK_2f1e9e1225e12d34fbe776e0c87"`,
    );

    await queryRunner.query(
      `ALTER TABLE "partners_service_provider_instance" DROP COLUMN "serviceProviderId"`,
    );
  }
}
