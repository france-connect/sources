/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { OverrideOidcProviderConfig } from '@fc/override-oidc-provider';

const env = new ConfigParser(process.env, 'OverrideOidcProvider');

export default {
  sigHsmPubKeys: env.json('CRYPTO_SIG_HSM_PUB_KEYS'),
} as OverrideOidcProviderConfig;
