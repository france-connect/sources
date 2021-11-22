/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CryptographyFcpConfig } from '@fc/cryptography-fcp';

const env = new ConfigParser(process.env, 'Cryptography');

export default {
  // Core Legacy ==> use of secret cookie key
  subSecretKey: env.string('SUB_SECRET'),
} as CryptographyFcpConfig;
