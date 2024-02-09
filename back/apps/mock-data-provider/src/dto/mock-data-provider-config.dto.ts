/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { DataProviderAdapterCoreConfig } from '@fc/data-provider-adapter-core';
import { LoggerConfig } from '@fc/logger';

import { AppConfig } from '../dto';

export class MockDataProviderConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => DataProviderAdapterCoreConfig)
  readonly DataProviderAdapterCore: DataProviderAdapterCoreConfig;
}
