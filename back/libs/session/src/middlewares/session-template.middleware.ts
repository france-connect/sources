import { Request, Response } from 'express';

import { Injectable, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { SessionConfig } from '../dto';
import { extractSessionFromRequest } from '../helper';
import { ITemplateExposed } from '../interfaces';
import { SessionService } from '../services';

@Injectable()
export class SessionTemplateMiddleware implements NestMiddleware {
  private templateExposed: ITemplateExposed;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly sessionService: SessionService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit() {
    const { templateExposed } = this.config.get<SessionConfig>('Session');
    this.templateExposed = templateExposed;
  }

  async use(req: Request, res: Response, next: () => void) {
    this.logger.trace('SessionTemplateInterceptor');

    if (this.templateExposed) {
      const sessionParts = await this.getSessionParts(
        this.templateExposed,
        req,
      );
      res.locals.session = sessionParts;
    }
    next();
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
      .map((sessionService) => sessionService.get());

    const data = await Promise.all(extractSession);

    return data;
  }

  private async getSessionParts(parts, req) {
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
