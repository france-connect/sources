import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { SessionConfig } from '../dto';
import { extractSessionFromRequest } from '../helper';
import { ISessionRequest, ISessionResponse } from '../interfaces';
import { TemplateExposedType } from '../types';

@Injectable()
export class SessionTemplateService {
  constructor(private readonly config: ConfigService) {}

  async bindSessionToRes(req: ISessionRequest, res: ISessionResponse) {
    const { templateExposed } = this.config.get<SessionConfig>('Session');

    if (templateExposed) {
      const sessionParts = await this.getSessionParts(templateExposed, req);
      res.locals.session = sessionParts;
    }
  }

  async getSessionParts(parts: TemplateExposedType, req: ISessionRequest) {
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
    req: ISessionRequest,
  ) {
    const extractSession = moduleNames
      .map((moduleName) => extractSessionFromRequest(moduleName, req))
      .map(async (sessionService) => await sessionService.get());

    const data = await Promise.all(extractSession);

    return data;
  }
}
