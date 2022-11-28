import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { SessionConfig } from '@fc/session';

import { extractSessionFromRequest } from '../helper';
import { TemplateExposedType } from '../types';

@Injectable()
export class SessionTemplateInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.logger.trace('SessionTemplateInterceptor');

    const { templateExposed } = this.config.get<SessionConfig>('Session');
    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const isHandleSession = req.sessionId !== undefined;

    if (templateExposed && isHandleSession) {
      const sessionParts = await this.getSessionParts(templateExposed, req);
      res.locals.session = sessionParts;
    }

    return next.handle();
  }

  private fillObject(filters, source) {
    const picks = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const pickedData = Object.entries(source).filter(([key]) =>
      picks.includes(key),
    );

    const data = Object.fromEntries(pickedData);

    const exportData = JSON.parse(JSON.stringify(data));

    return exportData;
  }

  private async exposedDataForModules(
    moduleNames: string[],
    req: IncomingMessage,
  ) {
    const extractSession = moduleNames
      .map((moduleName) => extractSessionFromRequest(moduleName, req))
      .map(async (sessionService) => await sessionService.get());

    const data = await Promise.all(extractSession);

    return data;
  }

  private async getSessionParts(
    parts: TemplateExposedType,
    req: IncomingMessage,
  ) {
    const moduleNames = Object.keys(parts);
    const data = await this.exposedDataForModules(moduleNames, req);

    const sessions = moduleNames
      .map((moduleName, i) => [moduleName, data[i]]) // group module and data
      .filter(([_, value]) => Boolean(value)) // clean void module
      .map(([moduleName, data]: [string, any]) => {
        const filters = parts[moduleName];
        const filteredData = this.fillObject(filters, data);
        return [moduleName, filteredData];
      });

    const sessionsParts = Object.fromEntries(sessions);
    return sessionsParts;
  }
}
