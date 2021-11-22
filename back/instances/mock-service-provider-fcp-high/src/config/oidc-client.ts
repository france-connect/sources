/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientConfig } from '@fc/oidc-client';

const env = new ConfigParser(process.env, 'OidcClient');

export default {
  // Toggle Financial Grade API
  fapi: env.boolean('FAPI'),
  httpOptions: {
    cert: env.file('HTTPS_CLIENT_CERT'),
    key: env.file('HTTPS_CLIENT_KEY'),

    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
  jwks: {
    keys: [JSON.parse(process.env.JWKS)],
  },
  scope: env.string('SCOPE'),
  stateLength: 32,
} as OidcClientConfig;
