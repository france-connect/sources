import { DynamicModule, Global, Module } from '@nestjs/common';

import { PluggableModule, PluginInterface } from '@fc/plugins';

import { LoggerPluginServiceInterface } from './interfaces';
import { LoggerService, NestLoggerService } from './services';
import { PLUGIN_SERVICES } from './tokens';

@Global()
@Module({})
export class LoggerModule extends PluggableModule {
  static forRoot(
    plugins: PluginInterface<LoggerPluginServiceInterface>[] = [],
  ): DynamicModule {
    return {
      module: LoggerModule,
      imports: [...this.getPluginsImports(plugins)],
      providers: [
        {
          provide: PLUGIN_SERVICES,
          useFactory: (...services) => {
            return services;
          },
          inject: this.getPluginsProviders(plugins),
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
