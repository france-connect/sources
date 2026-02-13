import * as fs from 'fs';

import postgres from 'postgres';

const sslVolumesDir = process.env.SSL_VOLUMES_DIR;
const sslOptions = {
  ca: fs.readFileSync(`${sslVolumesDir}/docker-stack-ca.crt`),
  cert: fs.readFileSync(`${sslVolumesDir}/postgres.partner.client.crt`),
  key: fs.readFileSync(`${sslVolumesDir}/postgres.partner.client.key`),
  rejectUnauthorized: false,
};
const POSTGRES_HOST = 'postgres';
const POSTGRES_URI = `postgres://partners_user:partners_passwd@${POSTGRES_HOST}:5432/pg_partners`;

interface PgFindManyArgs {
  versionId?: string;
}

export async function pgFindVersions(args: PgFindManyArgs): Promise<unknown[]> {
  const { versionId: id } = args;
  const sql = postgres(POSTGRES_URI, { ssl: sslOptions });
  const result = sql`
    select * from partners_service_provider_instance_version ${
      id ? sql`where id = ${id}` : sql``
    }
  `;
  return result;
}
