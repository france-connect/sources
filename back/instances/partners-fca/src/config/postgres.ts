/* istanbul ignore file */

// Tested by DTO
import * as entities from '@entities/typeorm';

import { ConfigParser } from '@fc/config';
import { PostgresConfig } from '@fc/postgres';

const env = new ConfigParser(process.env, 'Postgres');

export default {
  type: env.string('TYPE'),
  host: env.string('HOST'),
  port: env.number('PORT'),
  database: env.string('DATABASE'),
  username: env.string('USER'),
  password: env.string('PASSWORD'),
  entities: Object.values(entities),
  synchronize: false, // do not set to true, we do not want schema automatic creation
} as PostgresConfig;
