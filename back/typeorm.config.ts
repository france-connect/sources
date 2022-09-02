import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.Postgres_HOST,
  port: Number(process.env.Postgres_PORT),
  database: process.env.Postgres_DATABASE,
  username: process.env.Postgres_USER,
  password: process.env.Postgres_PASSWORD,
  entities: [`${__dirname}/entities/typeorm/**/*.entity.{ts,js}`],
  migrations: [`${__dirname}/migrations/${process.env.APP_NAME}/**/*{.ts,.js}`],
  synchronize: false, // do not set to true, we do not want schema automatic creation
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });

export default AppDataSource;
