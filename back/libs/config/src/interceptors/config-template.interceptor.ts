import { Observable } from 'rxjs';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { ConfigService } from '../config.service';
import { ConfigConfig } from '../dto';
import { TemplateExposedType } from '../types';

@Injectable()
export class ConfigTemplateInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse();
    const { templateExposed } = this.config.get<ConfigConfig>('Config');

    if (templateExposed) {
      const configParts = this.getConfigParts(templateExposed);
      res.locals.config = configParts;
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

  private getConfigParts(parts: TemplateExposedType) {
    const moduleNames = Object.keys(parts);

    const config = moduleNames
      .filter(([_, value]) => Boolean(value)) // clean void module
      .map((moduleName: string) => {
        const data = this.config.get(moduleName);
        const filters = parts[moduleName];
        const filteredData = this.fillObject(filters, data);
        return [moduleName, filteredData];
      });

    const configParts = Object.fromEntries(config);
    return configParts;
  }
}
