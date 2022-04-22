/* istanbul ignore file */

// Tested by DTO
import { LoggerConfig } from '@fc/logger-legacy';

export default {
  path: process.env.EVT_LOG_FILE,
  level: process.env.LOG_LEVEL,
  isDevelopment: process.env.NODE_ENV === 'development',
} as LoggerConfig;
