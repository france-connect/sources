import { readFileSync } from 'fs';

import { DataSource } from 'typeorm';

/**
 * TypeORM configuration for running migrations only.
 * This configuration does not load entities as they are not needed
 * for migration execution and may have dependencies not available in production.
 *
 */
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.Postgres_HOST,
  port: Number(process.env.Postgres_PORT),
  database: process.env.Postgres_DATABASE,
  username: process.env.Postgres_USER,
  password: process.env.Postgres_PASSWORD,
  ssl: {
    rejectUnauthorized: Boolean(process.env.Postgres_SSL_REJECT_UNAUTHORIZED),
    ca: readFileSync(process.env.Postgres_SSL_CA),
    key: readFileSync(process.env.Postgres_SSL_KEY),
    cert: readFileSync(process.env.Postgres_SSL_CERT),
  },
  entities: [], // No entities needed for migration:run
  migrations: [`${__dirname}/migrations/${process.env.APP_NAME}/**/*{.ts,.js}`],
  synchronize: false, // do not set to true, we do not want schema automatic creation
});

module.exports = AppDataSource;
