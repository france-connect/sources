import { MigrationInterface, QueryRunner } from 'typeorm';

export class NormalizeAccountEmails1773933974895 implements MigrationInterface {
  name = 'NormalizeAccountEmails1773933974895';

  private readonly backupTable =
    '_migration_normalize_emails_1773933974895';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: create a persistent backup table (used by down() and the cleanup migration)
    //
    // ROW_NUMBER() on LOWER(email) ensures exactly one "keep" per group, even for
    // 3+ duplicates. Stores deleted account data and migrated instance/permission IDs
    // to allow a clean rollback.
    await queryRunner.query(`
      CREATE TABLE ${this.backupTable} AS
      WITH ranked AS (
        SELECT
          id,
          LOWER(email) AS email_lower,
          ROW_NUMBER() OVER (
            PARTITION BY LOWER(email)
            ORDER BY "lastConnection" DESC NULLS LAST, "createdAt" ASC, id ASC
          ) AS rn
        FROM partners_account
      ),
      groups_with_duplicates AS (
        SELECT email_lower FROM ranked
        GROUP BY email_lower HAVING COUNT(*) > 1
      )
      SELECT
        keep_acct.id                AS keep_id,
        keep_acct.email             AS keep_email_original,
        del_acct.id                 AS delete_id,
        del_acct.sub                AS delete_sub,
        del_acct.email              AS delete_email,
        del_acct.firstname          AS delete_firstname,
        del_acct.lastname           AS delete_lastname,
        del_acct."lastConnection"   AS delete_last_connection,
        del_acct."createdAt"        AS delete_created_at,
        del_acct."updatedAt"        AS delete_updated_at,
        ARRAY(
          SELECT i.id FROM partners_service_provider_instance i
          WHERE i."creatorId" = del_ranked.id
        ) AS migrated_instance_ids,
        ARRAY(
          SELECT p.id FROM partners_account_permission p
          WHERE p."accountId" = del_ranked.id
            AND p."entityId" != '00000000-0000-0000-0000-000000000000'
            AND NOT EXISTS (
              SELECT 1 FROM partners_account_permission pk
              WHERE pk."accountId"      = keep_ranked.id
                AND pk."entityId"       = p."entityId"
                AND pk.entity           = p.entity
                AND pk."permissionType" = p."permissionType"
            )
        ) AS migrated_permission_ids
      FROM ranked AS del_ranked
      JOIN ranked AS keep_ranked
        ON keep_ranked.email_lower = del_ranked.email_lower AND keep_ranked.rn = 1
      JOIN groups_with_duplicates g ON g.email_lower = del_ranked.email_lower
      JOIN partners_account keep_acct ON keep_acct.id = keep_ranked.id
      JOIN partners_account del_acct  ON del_acct.id  = del_ranked.id
      WHERE del_ranked.rn > 1
    `);

    // Step 2: reassign instances to the keep account
    await queryRunner.query(`
      UPDATE partners_service_provider_instance
      SET "creatorId" = backup.keep_id
      FROM ${this.backupTable} AS backup
      WHERE "creatorId" = backup.delete_id
    `);

    // Step 3: delete generic permissions from the delete account
    // (the keep account already has them from its own creation)
    await queryRunner.query(`
      DELETE FROM partners_account_permission
      WHERE "accountId" IN (SELECT delete_id FROM ${this.backupTable})
        AND "entityId" = '00000000-0000-0000-0000-000000000000'
    `);

    // Step 4: delete exact duplicate specific permissions on both accounts
    // (prevents a constraint violation when reassigning in step 5)
    await queryRunner.query(`
      DELETE FROM partners_account_permission AS pd
      USING ${this.backupTable} AS backup
      WHERE pd."accountId" = backup.delete_id
        AND EXISTS (
          SELECT 1 FROM partners_account_permission pk
          WHERE pk."accountId"      = backup.keep_id
            AND pk."entityId"       = pd."entityId"
            AND pk.entity           = pd.entity
            AND pk."permissionType" = pd."permissionType"
        )
    `);

    // Step 5: reassign remaining specific permissions to the keep account
    await queryRunner.query(`
      UPDATE partners_account_permission
      SET "accountId" = backup.keep_id
      FROM ${this.backupTable} AS backup
      WHERE "accountId" = backup.delete_id
    `);

    // Step 6: delete orphaned delete accounts (no more instances or permissions)
    await queryRunner.query(`
      DELETE FROM partners_account
      WHERE id IN (SELECT delete_id FROM ${this.backupTable})
    `);

    // Step 7: normalize all remaining emails to lowercase
    // Duplicates have been removed so the UNIQUE constraint cannot be violated.
    await queryRunner.query(`
      UPDATE partners_account
      SET email = LOWER(email)
      WHERE email != LOWER(email)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const backupExists = await queryRunner.query(`
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = '${this.backupTable}'
    `);

    if (!backupExists.length) {
      throw new Error(
        `Backup table "${this.backupTable}" not found. ` +
          'Restore the database from a backup taken before this migration.',
      );
    }

    // Restore original email casing on kept accounts
    await queryRunner.query(`
      UPDATE partners_account
      SET email = backup.keep_email_original
      FROM ${this.backupTable} AS backup
      WHERE partners_account.id = backup.keep_id
    `);

    // Recreate deleted accounts
    await queryRunner.query(`
      INSERT INTO partners_account
        (id, sub, email, firstname, lastname, "lastConnection", "createdAt", "updatedAt")
      SELECT
        delete_id, delete_sub, delete_email, delete_firstname, delete_lastname,
        delete_last_connection, delete_created_at, delete_updated_at
      FROM ${this.backupTable}
    `);

    // Reassign instances back to their original creator
    await queryRunner.query(`
      UPDATE partners_service_provider_instance
      SET "creatorId" = backup.delete_id
      FROM ${this.backupTable} AS backup
      WHERE id = ANY(backup.migrated_instance_ids)
    `);

    // Reassign migrated specific permissions back to their original account
    await queryRunner.query(`
      UPDATE partners_account_permission
      SET "accountId" = backup.delete_id
      FROM ${this.backupTable} AS backup
      WHERE id = ANY(backup.migrated_permission_ids)
    `);

    // Recreate the generic permission for each restored account
    await queryRunner.query(`
      INSERT INTO partners_account_permission ("accountId", "entityId", entity, "permissionType")
      SELECT backup.delete_id, '00000000-0000-0000-0000-000000000000', perm.entity, perm."permissionType"
      FROM ${this.backupTable} AS backup
      JOIN partners_account_permission perm
        ON perm."accountId" = backup.keep_id
        AND perm."entityId" = '00000000-0000-0000-0000-000000000000'
    `);

    await queryRunner.query(`DROP TABLE ${this.backupTable}`);
  }
}
