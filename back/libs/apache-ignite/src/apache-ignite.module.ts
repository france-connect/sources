import { DynamicModule, Module } from '@nestjs/common';

import { ApacheIgniteService } from './apache-ignite.service';
import { APACHE_IGNITE_CONFIG_NAME } from './tokens';

@Module({})
export class ApacheIgniteModule {
  /**
   * Each call creates its own ApacheIgniteService instance (and thus its own
   * ignite client), connected with the given config section.
   *
   * @param configName Name of the config part to use (ie. "ApacheIgniteConnector")
   */
  static forConfig(configName: string): DynamicModule {
    const configNameProvider = {
      provide: APACHE_IGNITE_CONFIG_NAME,
      useValue: configName,
    };

    return {
      module: ApacheIgniteModule,
      providers: [configNameProvider, ApacheIgniteService],
      exports: [ApacheIgniteService],
    };
  }
}
