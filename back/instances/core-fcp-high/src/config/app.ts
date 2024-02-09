/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/core-fcp';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: 'fcplus',
  platform: 'FranceConnect+',
  urlPrefix: '/api/v2',
  assetsPaths: env.json('ASSETS_PATHS'),
  assetsDsfrPaths: env.json('DSFR_ASSETS_PATHS'),
  assetsCacheTtl: env.number('ASSETS_CACHE_TTL'),
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: process.env.FQDN,
  udFqdn: process.env.UD_FQDN,
  minAcrForContextRequest: 'eidas2',
  eidasBridgeUid: env.string('EIDAS_BRIDGE_UID'),
  sortedClaims: [
    'family_name',
    'preferred_username',
    'given_name',
    'gender',
    'birthdate',
    'birthplace',
    'birthcountry',
    'address',
    'email',
    'phone_number',
  ],
} as AppConfig;
