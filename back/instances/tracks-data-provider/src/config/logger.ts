/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { LoggerConfig } from '@fc/logger';

const env = new ConfigParser(process.env, 'Logger');

export default {
  isDevelopment: process.env.NODE_ENV === 'development',
  level: env.string('LEVEL'),
  path: env.string('FILE'),
} as LoggerConfig;
