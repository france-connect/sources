/* istanbul ignore file */

// Tested by DTO
import { readFileSync } from 'fs';

import { OidcClientConfig } from '@fc/oidc-client';

export default {
  httpOptions: {
    key: readFileSync(process.env.HTTPS_CLIENT_KEY).toString('utf8'),
    cert: readFileSync(process.env.HTTPS_CLIENT_CERT).toString('utf8'),

    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
  jwks: {
    keys: [JSON.parse(process.env.JWKS)],
  },
  stateLength: 32,
  // Toggle Financial Grade API

  /**
   * @TODO migrate User Dashboard to ConfigParser
   * This must be done while giving US its own stack.
   */
  fapi: false,
  scope:
    'openid gender birthdate birthcountry birthplace given_name family_name email preferred_username address phone',
  acr: 'eidas1',
} as OidcClientConfig;
