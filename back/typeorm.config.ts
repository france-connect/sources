export default {
  type: 'postgres',
  host: process.env.Postgres_HOST,
  port: process.env.Postgres_PORT,
  database: process.env.Postgres_DATABASE,
  username: process.env.Postgres_USER,
  password: process.env.Postgres_PASSWORD,
  entities: [`${__dirname}/entities/typeorm/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/${process.env.APP_NAME}/**/*{.ts,.js}`],
  cli: {
    migrationsDir: `${__dirname}/migrations/${process.env.APP_NAME}`,
  },
  synchronize: false, // do not set to true, we do not want schema automatic creation
};
