import { ConfigParser } from '@fc/config';
import { CoreConfig, IdentitySource } from '@fc/core-fcp';

const env = new ConfigParser(process.env, 'Core');

export default {
  allowedIdpHints: env.json('ALLOWED_IDP_HINTS'),
  defaultRedirectUri: 'https://franceconnect.gouv.fr',
  supportFormUrl: env.string('SUPPORT_FORM_URL'),
  useIdentityFrom: IdentitySource.RNIPP,
  enableSso: true,
} as CoreConfig;
