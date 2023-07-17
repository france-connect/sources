/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { EidasBridgeRoutes } from '@fc/eidas-bridge';
import { OidcClientConfig, OidcClientRoutes } from '@fc/oidc-client';

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
  // Do not ask for scope since they are built at run time.

  // Toggle Financial Grade API
  fapi: env.boolean('FAPI'),
  postLogoutRedirectUri: `https://${app.fqdn}${app.urlPrefix}${OidcClientRoutes.CLIENT_LOGOUT_CALLBACK}`,
  redirectUri: `https://${app.fqdn}${app.urlPrefix}${EidasBridgeRoutes.BASE}${EidasBridgeRoutes.REDIRECT_TO_EIDAS_RESPONSE_PROXY}`,
} as OidcClientConfig;
