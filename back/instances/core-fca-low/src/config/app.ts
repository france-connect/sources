/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/core-fca';

const env = new ConfigParser(process.env, 'App');

export default {
  apiOutputContentType: env.string('API_OUTPUT_CONTENT_TYPE'),
  name: 'CORE_FCA_LOW',
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
  defaultIdpId: env.string('DEFAULT_IDP_UID'),
  spAuthorizedFqdnsConfigs: [...env.json('SP_AUTHORIZED_FQDNS_CONFIGS')],
  defaultEmailRenater: env.string('DEFAULT_EMAIL_RENATER'),
  contentSecurityPolicy: {
    defaultSrc: env.json('CSP_DEFAULT_SRC'),
    styleSrc: env.json('CSP_STYLE_SRC'),
    scriptSrc: env.json('CSP_SCRIPT_SRC'),
    connectSrc: env.json('CSP_CONNECT_SRC'),
    frameAncestors: env.json('CSP_FRAME_ANCESTORS'),
    imgSrc: env.json('CSP_IMG_SRC'),
  },
  environment: env.string('ENVIRONMENT'),
} as AppConfig;
