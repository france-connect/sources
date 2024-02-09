/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { LoggerConfig } from '@fc/logger-legacy';

const env = new ConfigParser(process.env, 'LoggerLegacy');

export default {
  path: env.string('FILE'),
} as LoggerConfig;
