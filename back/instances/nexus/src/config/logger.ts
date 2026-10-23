import { ConfigParser } from '@fc/config';
import { LoggerConfig } from '@fc/logger';

const env = new ConfigParser(process.env, 'Logger');

export default {
  threshold: env.string('THRESHOLD'),
} as LoggerConfig;
