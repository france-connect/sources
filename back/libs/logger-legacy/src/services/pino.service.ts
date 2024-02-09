import pino, { DestinationStream, Logger } from 'pino';

import { Injectable, ShutdownSignal } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { LoggerConfig as LoggerLegacyConfig } from '../dto';
import { LoggerLevelCodes } from '../enum';
import { pinoLevelsMap } from '../log-maps.map';

/**
 * Formatter for pino library
 * @see https://github.com/pinojs/pino/blob/master/docs/api.md#formatters-object
 */
export function formatLevel(label: string, _number: number): { level: string } {
  return { level: label };
}

const PINO_LEVEL_BUSINESS = 'info';

@Injectable()
export class PinoService {
  public readonly transport: Logger;
  public readonly level: LoggerLevelCodes;

  constructor(private readonly config: ConfigService) {
    const { path } = this.config.get<LoggerLegacyConfig>('LoggerLegacy');

    this.level = pinoLevelsMap[PINO_LEVEL_BUSINESS];

    const stream = this.getDestinationForLog(path);
    this.transport = pino(
      {
        formatters: {
          level: formatLevel,
        },
        level: PINO_LEVEL_BUSINESS,
      },
      stream,
    );
  }

  private getDestinationForLog(path: string): DestinationStream {
    const stream = pino.destination(path);
    process.on(ShutdownSignal.SIGUSR2, () => {
      // keep warnnings here, this log must not be in business logs
      console.warn(`SIGUSR2: Reveived, reopening at ${path}`);
      stream.reopen();
      console.warn('SIGUSR2: done');
    });
    return stream;
  }
}
