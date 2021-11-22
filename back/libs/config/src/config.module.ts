import { DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigService } from './config.service';

@Module({})
@Global()
export class ConfigModule {
  // does not need to be tested
  // istanbul ignore next
  static forRoot(service): DynamicModule {
    const provider = {
      provide: ConfigService,
      useValue: service,
    };

    return {
      module: ConfigModule,
      providers: [provider],
      exports: [ConfigService],
    };
  }
}
