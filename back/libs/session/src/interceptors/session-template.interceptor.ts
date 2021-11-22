import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { SessionConfig } from '@fc/session';

import { extractSessionFromRequest } from '../decorators';
import { ITemplateExposed } from '../interfaces';
import { SessionService } from '../services';
import { ExcludedRoutes } from '../types';

@Injectable()
export class SessionTemplateInterceptor implements NestInterceptor {
  private templateExposed: ITemplateExposed;
  private excludedRoutes: ExcludedRoutes;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);

    const { templateExposed, excludedRoutes } =
      this.config.get<SessionConfig>('Session');
    this.templateExposed = templateExposed;
    this.excludedRoutes = excludedRoutes;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    this.logger.trace('SessionTemplateInterceptor');

    const res = context.switchToHttp().getResponse();
    const req = context.switchToHttp().getRequest();

    const isHandleSession = this.sessionService.shouldHandleSession(
      req.route.path,
      this.excludedRoutes,
    );

    if (this.templateExposed && isHandleSession) {
      const sessionParts = await this.getSessionParts(
        this.templateExposed,
        context,
      );
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
  private async exposedDataForModules(moduleNames: string[], ctx) {
    const extractSession = moduleNames
      .map((moduleName) => extractSessionFromRequest(moduleName, ctx))
      .map(async (sessionService) => await sessionService.get());
    const data = await Promise.all(extractSession);
    return data;
  }

  private async getSessionParts(parts, context) {
    const moduleNames = Object.keys(parts);
    const data = await this.exposedDataForModules(moduleNames, context);

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
