import { ConfigParser } from '@fc/config';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';

const env = new ConfigParser(process.env, 'CryptographyBroker');

export default {
  urls: env.json('URLS'),
  queue: env.string('QUEUE'),
  queueOptions: {
    durable: true,
    arguments: {
      'x-message-ttl': env.number('MESSAGE_TTL'),
    },
  },
  payloadEncoding: 'base64',

  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
} as MicroservicesRmqConfig;
