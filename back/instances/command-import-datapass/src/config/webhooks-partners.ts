import { ConfigParser } from '@fc/config';

import { WebhooksPartnersConfig } from '../dto';

const env = new ConfigParser(process.env, 'WebhooksPartners');

export default {
  secret: env.string('SECRET'),
  url: env.string('URL'),
} as WebhooksPartnersConfig;
