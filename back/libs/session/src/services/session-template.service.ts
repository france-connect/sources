import { get } from 'lodash';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { TemplateMethod } from '@fc/view-templates';

import { SessionConfig } from '../dto';
import { TemplateExposedType } from '../types';
import { SessionService } from './session.service';

@Injectable()
export class SessionTemplateService {
  constructor(
    private readonly config: ConfigService,
    private readonly session: SessionService,
  ) {}

  @TemplateMethod('session')
  get(key: string): unknown {
    const { templateExposed } = this.config.get<SessionConfig>('Session');

    if (templateExposed) {
      const sessionParts = this.getSessionParts(templateExposed);
      return get(sessionParts, key);
    }
  }

  getSessionParts(parts: TemplateExposedType) {
    const moduleNames = Object.keys(parts);
    const data = this.exposedDataForModules(moduleNames);

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

  private exposedDataForModules(moduleNames: string[]) {
    const extractSession = moduleNames.map((moduleName) =>
      this.session.get(moduleName),
    );

    return extractSession;
  }
}
