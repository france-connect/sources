/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/eidas-bridge';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: 'EIDAS_BRIDGE',
  urlPrefix: '',
  assetsPaths: env.json('ASSETS_PATHS'),
  assetsDsfrPaths: env.json('DSFR_ASSETS_PATHS'),
  assetsCacheTtl: env.number('ASSETS_CACHE_TTL'),
  viewsPaths: env.json('VIEWS_PATHS'),
  countryIsoList: env.json('AVAILABLE_COUNTRIES'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: process.env.FQDN,
  idpId: env.string('IDP_ID'),
} as AppConfig;
