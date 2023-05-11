/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CoreConfig, IdentitySource } from '@fc/core-fcp';

const env = new ConfigParser(process.env, 'Core');

export default {
  defaultRedirectUri: 'https://franceconnect.gouv.fr',
  supportFormUrl: env.string('SUPPORT_FORM_URL'),
  supportFormCodes: [
    'Y000001',
    'Y000003',
    'Y000005',
    'Y000007',
    'Y010004',
    'Y010006',
    'Y010007',
    'Y010008',
    'Y010011',
    'Y010012',
    'Y010013',
    'Y010015',
    'Y020000',
    'Y020001',
    'Y020002',
    'Y020021',
    'Y020024',
    'Y020025',
    'Y020026',
    'Y020027',
    'Y020028',
    'Y030002',
    'Y030004',
    'Y030005',
    'Y030007',
    'Y030009',
    'Y030026',
    'Y160001',
    'Y160003',
    'Y160004',
    'Y180001',
    'Y190005',
    'Y200001',
    'Y200002',
    'Y270001',
    'Y270002',
    'Y270003',
  ],
  useIdentityFrom: IdentitySource.RNIPP,
  enableSso: true,
} as CoreConfig;
