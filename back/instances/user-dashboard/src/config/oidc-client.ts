/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientConfig, OidcClientRoutes } from '@fc/oidc-client';
import { UserDashboardBackRoutes } from '@fc/user-dashboard';

import app from './app';

const env = new ConfigParser(process.env, 'OidcClient');

export default {
  httpOptions: {
    key: env.file('HTTPS_CLIENT_KEY'),
    cert: env.file('HTTPS_CLIENT_CERT'),
    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
  jwks: {
    keys: [env.json('JWKS')],
  },
  stateLength: 32,
  // Toggle Financial Grade API

  /**
   * @TODO migrate User Dashboard to ConfigParser
   * This must be done while giving US its own stack.
   */
  fapi: false,
  scope:
    'openid gender birthdate birthcountry birthplace given_name family_name email idp_id',
  postLogoutRedirectUri: `https://${app.fqdn}${app.urlPrefix}${UserDashboardBackRoutes.LOGOUT_CALLBACK}`,
  redirectUri: `https://${app.fqdn}${app.urlPrefix}${OidcClientRoutes.OIDC_CALLBACK}`,
} as OidcClientConfig;
