import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common';

export interface LoggerPluginServiceInterface {
  getContext: () => Record<string, unknown>;
}

export interface LoggerPluginInterface {
  readonly imports: Type<ModuleMetadata | DynamicModule>[];

  readonly service: Type<LoggerPluginServiceInterface>;
}
