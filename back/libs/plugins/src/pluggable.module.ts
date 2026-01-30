import { DynamicModule, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';

import { PluginInterface } from './interfaces';

export abstract class PluggableModule {
  static getPluginsImports(
    plugins: PluginInterface<unknown>[],
  ): Type<ModuleMetadata | DynamicModule>[] {
    const imports = [];

    plugins.forEach((plugin) => {
      imports.push(...plugin.imports);
    });

    return Array.from(new Set<Type<ModuleMetadata | DynamicModule>>(imports));
  }

  static getPluginsProviders(
    plugins: PluginInterface<unknown>[],
  ): Type<unknown>[] {
    return plugins.map((plugin) => plugin.service);
  }
}
