/* istanbul ignore file */

// Tested by DTO
import { ConfigParser } from '@fc/config';
import { LoggerConfig } from '@fc/logger';

const env = new ConfigParser(process.env, 'Logger');

export default {
  threshold: env.string('THRESHOLD'),
  stdoutLevels: env.json('STDOUT_LEVELS'),
  stderrLevels: env.json('STDERR_LEVELS'),
} as LoggerConfig;
