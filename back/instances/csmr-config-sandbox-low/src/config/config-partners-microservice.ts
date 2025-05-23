import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'MicroserviceConfigPartners');

export default {
  urls: env.json('URLS'),
  queue: env.string('QUEUE'),
  queueOptions: {
    durable: false,
  },
  payloadEncoding: 'base64',

  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
} as RabbitmqConfig;
