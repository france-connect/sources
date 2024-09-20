/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientConfig } from '@fc/oidc-client';

const env = new ConfigParser(process.env, 'OidcClient');

export default {
  httpOptions: {
    key: env.file('HTTPS_CLIENT_KEY'),
    cert: env.file('HTTPS_CLIENT_CERT'),

    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
  stateLength: 32,

  scope: env.string('SCOPE'),
  // Toggle Financial Grade API
  fapi: env.boolean('FAPI'),
  postLogoutRedirectUri: env.string('POST_LOGOUT_REDIRECT_URI'),
  redirectUri: env.string('REDIRECT_URI'),
} as OidcClientConfig;
