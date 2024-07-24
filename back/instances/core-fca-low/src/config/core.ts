/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { CoreConfig } from '@fc/core';

const env = new ConfigParser(process.env, 'Core');

export default {
  allowedIdpHints: env.json('ALLOWED_IDP_HINTS'),
  defaultRedirectUri: 'https://agentconnect.gouv.fr',
  enableSso: true,
} as CoreConfig;
