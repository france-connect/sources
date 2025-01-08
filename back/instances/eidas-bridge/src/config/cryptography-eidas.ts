import { ConfigParser } from '@fc/config';
import { CryptographyEidasConfig } from '@fc/cryptography-eidas';

const env = new ConfigParser(process.env, 'Cryptography');

export default {
  subSecretKey: env.string('CRYPTO_SUB_SECRET'),
} as CryptographyEidasConfig;
