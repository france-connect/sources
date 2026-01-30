import { readFileSync } from 'fs';

import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
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
  entities: [`${__dirname}/entities/typeorm/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/${process.env.APP_NAME}/**/*{.ts,.js}`],
  synchronize: false, // do not set to true, we do not want schema automatic creation
};

const AppDataSource = new DataSource(dataSourceOptions);

module.exports = AppDataSource;
