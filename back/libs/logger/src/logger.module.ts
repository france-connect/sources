import { DynamicModule, Global, Module } from '@nestjs/common';

import { LoggerPluginInterface } from './interfaces';
import { LoggerService, NestLoggerService } from './services';
import { PLUGIN_SERVICES } from './tokens';

@Global()
@Module({})
export class LoggerModule {
  static forRoot(plugins: LoggerPluginInterface[] = []): DynamicModule {
    const imports = [];

    plugins.forEach((plugin) => {
      imports.push(...plugin.imports);
    });

    const providers = plugins.map(({ service }) => service);

    return {
      module: LoggerModule,
      imports: [...new Set(imports)],
      providers: [
        {
          provide: PLUGIN_SERVICES,
          useFactory: (...services) => {
            return services;
          },
          inject: providers,
        },
        {
          provide: LoggerService,
          useClass: LoggerService,
        },
        {
          provide: NestLoggerService,
          useClass: NestLoggerService,
        },
      ],
      exports: [LoggerService, NestLoggerService],
    };
  }
}
