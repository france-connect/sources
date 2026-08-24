import { ConfigParser } from '@fc/config';
import { AppConfig } from '@fc/mock-wallet';

const env = new ConfigParser(process.env, 'App');

export default {
  name: 'MOCK_WALLET',
  urlPrefix: '/',
  assetsUrlPrefix: env.string('ASSETS_URL_PREFIX'),
  assetsUrlDomain: env.string('ASSETS_URL_DOMAIN'),
  assetsPaths: env.json('ASSETS_PATHS'),
  assetsCacheTtl: env.number('ASSETS_CACHE_TTL'),
  viewsPaths: env.json('VIEWS_PATHS'),
  httpsOptions: {
    key: env.file('HTTPS_SERVER_KEY', { optional: true }),
    cert: env.file('HTTPS_SERVER_CERT', { optional: true }),
  },
  fqdn: env.string('FQDN'),
  timezone: 'Europe/Paris',
  environment: env.string('ENVIRONMENT'),
  identitiesCsvPath: env.string('IDENTITIES_CSV_PATH'),

  allowedAlgs: env.json('ALLOWED_ALGS'),
  allowedResponseModes: env.json('ALLOWED_RESPONSE_MODES'),
  skipSignatureVerification: env.boolean('SKIP_SIGNATURE_VERIFICATION'),
  permissiveContentType: env.boolean('PERMISSIVE_CONTENT_TYPE'),
  trustedJwks: { keys: env.json('TRUSTED_JWKS') },
  httpTimeoutMs: env.number('HTTP_TIMEOUT_MS'),
  responseContentType: env.string('RESPONSE_CONTENT_TYPE'),
} as AppConfig;
