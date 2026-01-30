import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common';

import { PluginInterface } from './interfaces';
import { PluggableModule } from './pluggable.module';

describe('PluggableModule', () => {
  const module1Mock = Symbol('module1') as unknown as Type<
    ModuleMetadata | DynamicModule
  >;
  const module2Mock = Symbol('module2') as unknown as Type<
    ModuleMetadata | DynamicModule
  >;
  const serviceMock = Symbol('service') as unknown as Type<unknown>;

  const pluginMock: PluginInterface<unknown> = {
    imports: [module1Mock, module2Mock],
    service: serviceMock,
  };

  describe('getPluginsImports', () => {
    it('should return the imports of the plugins', () => {
      // When
      const result = PluggableModule.getPluginsImports([pluginMock]);

      // Then
      expect(result).toEqual([module1Mock, module2Mock]);
    });

    it('should return the imports with unique values', () => {
      // When
      const result = PluggableModule.getPluginsImports([
        pluginMock,
        pluginMock,
      ]);

      // Then
      expect(result).toEqual([module1Mock, module2Mock]);
    });
  });

  describe('getPluginsProviders', () => {
    it('should return the providers of the plugins', () => {
      // When
      const result = PluggableModule.getPluginsProviders([pluginMock]);

      // Then
      expect(result).toEqual([serviceMock]);
    });
  });
});
