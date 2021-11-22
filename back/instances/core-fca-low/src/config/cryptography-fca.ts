/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CryptographyFcaConfig } from '@fc/cryptography-fca';

const env = new ConfigParser(process.env, 'CryptographyFca');

export default {
  // Core Legacy ==> use of secret cookie key
  subSecretKey: env.string('CRYPTO_SUB_SECRET'),
  hashSecretKey: env.string('CRYPTO_HASH_SECRET'),
} as CryptographyFcaConfig;
