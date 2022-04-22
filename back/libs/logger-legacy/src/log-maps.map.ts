import { LoggerLevelCodes } from './enum/logger-level-codes.enum';

/**
 * Map log levels between pino and nestJS
 *
 * NestJS has `log` and `verbose`
 * Pino has `trace` and `fatal`
 *
 */
export const pinoLevelsMap = {
  log: LoggerLevelCodes.TRACE,
  trace: LoggerLevelCodes.TRACE,
  verbose: LoggerLevelCodes.DEBUG,
  debug: LoggerLevelCodes.DEBUG,
  info: LoggerLevelCodes.INFO,
  warn: LoggerLevelCodes.WARN,
  error: LoggerLevelCodes.ERROR,
  fatal: LoggerLevelCodes.FATAL,
};

export const nestLevelsMap = {
  log: 'log',
  verbose: 'verbose',
  trace: 'log',
  debug: 'debug',
  info: 'log',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
};
