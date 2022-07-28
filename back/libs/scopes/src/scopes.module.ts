/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ScopesIndexService, ScopesService } from './services';
import { CONFIG_NAME } from './tokens';

const defaultConfigNameProvider = {
  provide: CONFIG_NAME,
  useValue: 'Scopes',
};

@Module({
  providers: [ScopesService, ScopesIndexService, defaultConfigNameProvider],
  exports: [ScopesService],
})
export class ScopesModule {
  /**
   *
   * @param config Name of the config part to use
   */
  static forConfig(config: string) {
    const instanceName = `Scopes${config}`;
    const configNameProvider = {
      provide: CONFIG_NAME,
      useValue: instanceName,
    };

    const scopeServiceProvider = {
      provide: instanceName,
      useClass: ScopesService,
    };

    return {
      module: ScopesModule,
      providers: [scopeServiceProvider, ScopesIndexService, configNameProvider],
      exports: [scopeServiceProvider],
    };
  }
}
