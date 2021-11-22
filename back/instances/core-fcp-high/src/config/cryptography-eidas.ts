/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CryptographyEidasConfig } from '@fc/cryptography-eidas';

const env = new ConfigParser(process.env, 'Cryptography');

export default {
  // Core Legacy ==> use of secret cookie key
  subSecretKey: env.string('CRYPTO_SUB_SECRET'),
} as CryptographyEidasConfig;
