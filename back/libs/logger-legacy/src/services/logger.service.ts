import { v4 as uuidV4 } from 'uuid';

import { ConsoleLogger, Injectable } from '@nestjs/common';

import { LoggerLevelNames } from '../enum';
import { ILoggerBusinessEvent } from '../interfaces';
import { pinoLevelsMap } from '../log-maps.map';
import { PinoService } from './pino.service';

/**
 * For usage and good practices:
 * @see https://gitlab.dev-franceconnect.fr/france-connect/fc/-/wikis/Logger
 */
@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(private readonly adapter: PinoService) {
    super(null);
  }

  private getIdentifiedLog(log) {
    const logId = uuidV4();
    return {
      ...log,
      logId,
    };
  }

  private canLog(level: string) {
    return this.adapter.level <= pinoLevelsMap[level];
  }

  private businessLogger(level: string, log: any) {
    if (this.canLog(level)) {
      const identifiedLog = this.getIdentifiedLog(log);
      this.adapter.transport[level](identifiedLog);
    }
  }

  // Business logic, goes in event logs
  businessEvent(log: ILoggerBusinessEvent) {
    this.businessLogger(LoggerLevelNames.INFO, log);
  }
}
