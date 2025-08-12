import { ConfigParser } from '@fc/config';
import { RabbitmqConfig } from '@fc/rabbitmq';

const env = new ConfigParser(process.env, 'TracksBroker');

export default {
  payloadEncoding: 'base64',
  queue: env.string('QUEUE'),
  queueOptions: {
    durable: true,
    arguments: {
      'x-message-ttl': env.number('MESSAGE_TTL'),
    },
  },
  // Global request timeout used for any outgoing app requests.
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10),
  urls: env.json('URLS'),
} as RabbitmqConfig;
