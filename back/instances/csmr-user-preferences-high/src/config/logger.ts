/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { LoggerConfig } from '@fc/logger';

const env = new ConfigParser(process.env, 'Logger');

export default {
  path: env.string('FILE'),
  level: env.string('LEVEL'),
  isDevelopment: process.env.NODE_ENV === 'development',
} as LoggerConfig;
