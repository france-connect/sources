import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';
import { ConfigTemplateHelper } from './helpers/config-template.helper';

@Module({})
@Global()
export class ConfigModule {
  static forRoot(service): DynamicModule {
    const provider = {
      provide: ConfigService,
      useValue: service,
    };

    return {
      module: ConfigModule,
      providers: [provider, ConfigTemplateHelper],
      exports: [ConfigService],
    };
  }
}
