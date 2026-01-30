import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common';

export interface PluginInterface<T> {
  readonly imports: Type<ModuleMetadata | DynamicModule>[];

  readonly service: Type<T>;
}
