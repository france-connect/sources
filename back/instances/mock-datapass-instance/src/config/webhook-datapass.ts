import { ConfigParser } from '@fc/config';
import { WebhooksConfig } from '@fc/webhooks';

const env = new ConfigParser(process.env, 'WebhooksDatapass');

export default {
  secret: env.string('SECRET'),
} as WebhooksConfig;
