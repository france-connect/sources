import { MigrationInterface, QueryRunner } from 'typeorm';

export class CleanupNormalizeAccountEmails1775836118873
  implements MigrationInterface
{
  name = 'CleanupNormalizeAccountEmails1775836118873';

  private readonly backupTable = '_migration_normalize_emails_1773933974895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS ${this.backupTable}`);
  }

  public down(): Promise<void> {
    throw new Error(
      `Cannot recreate "${this.backupTable}". ` +
        'Restore the database from a backup taken before the NormalizeAccountEmails migration.',
    );
  }
}
