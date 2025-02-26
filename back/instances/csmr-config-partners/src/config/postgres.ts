import {
  PartnersAccount,
  PartnersAccountPermission,
  PartnersOrganisation,
  PartnersPlatform,
  PartnersServiceProvider,
  PartnersServiceProviderInstance,
  PartnersServiceProviderInstanceVersion,
} from '@entities/typeorm';

import { ConfigParser } from '@fc/config';
import { PostgresConfig } from '@fc/postgres';

const env = new ConfigParser(process.env, 'Postgres');

export default {
  type: 'postgres',
  host: env.string('HOST'),
  port: env.number('PORT'),
  database: env.string('DATABASE'),
  username: env.string('USER'),
  password: env.string('PASSWORD'),
  entities: [
    PartnersAccount,
    PartnersAccountPermission,
    PartnersOrganisation,
    PartnersPlatform,
    PartnersServiceProvider,
    PartnersServiceProviderInstance,
    PartnersServiceProviderInstanceVersion,
  ],
  synchronize: false, // do not set to true, we do not want schema automatic creation
  ssl: {
    rejectUnauthorized: env.boolean('SSL_REJECT_UNAUTHORIZED'),
    ca: env.file('SSL_CA', { optional: true }),
    key: env.file('SSL_KEY', { optional: true }),
    cert: env.file('SSL_CERT', { optional: true }),
  },
} as PostgresConfig;
