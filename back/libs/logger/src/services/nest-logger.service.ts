import {
  ConsoleLogger,
  Injectable,
  LoggerService as LoggerServiceBase,
} from '@nestjs/common';

import { LoggerService } from './logger.service';

/**
 * Nest logger service use any as ConsoleLogger from NestJS.
 * Any is only used to satisfy the interface.
 */
@Injectable()
export class NestLoggerService
  extends ConsoleLogger
  implements LoggerServiceBase
{
  constructor(private readonly logger: LoggerService) {
    super();
  }

  log(message: any, context?: string): void;
  log(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.info({ optionalParams }, message);
  }

  fatal(message: any, context?: string): void;
  fatal(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.alert({ optionalParams }, message);
  }

  error(message: any, stackOrContext?: string): void;
  error(message: any, stack?: string, context?: string): void;
  error(message: any, ...optionalParams: [...any, string?, string?]) {
    this.logger.crit({ optionalParams }, message);
  }

  warn(message: any, context?: string): void;
  warn(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.warning({ optionalParams }, message);
  }

  debug(message: any, context?: string): void;
  debug(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.debug({ optionalParams }, message);
  }

  verbose(message: any, context?: string): void;
  verbose(message: any, ...optionalParams: [...any, string?]): void {
    this.logger.debug({ optionalParams }, message);
  }
}
