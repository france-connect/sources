/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OidcClientConfig } from '@fc/oidc-client';

const env = new ConfigParser(process.env, 'OidcClient');

export default {
  httpOptions: {
    // Global request timeout used for any outgoing app requests.
    timeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  },
  jwks: {
    keys: [env.json('CRYPTO_ENC_LOCALE_PRIV_KEY')],
  },
  stateLength: 32,
  /**
   * FCA specific scopes
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/215
   * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/issues/216
   */
  scope: env.string('SCOPE'),
  // Toggle Financial Grade API
  fapi: env.boolean('FAPI'),
} as OidcClientConfig;
