/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { HsmConfig } from '@fc/hsm';

const env = new ConfigParser(process.env, 'Hsm');

export default {
  libhsm: env.string('LIB'),
  pin: env.string('PIN'),
  virtualHsmSlot: env.number('VIRTUAL_HSM_SLOT'),
  sigKeyCkaLabel: env.string('SIG_HSM_PUB_KEY_CKA_LABEL'),
} as HsmConfig;
