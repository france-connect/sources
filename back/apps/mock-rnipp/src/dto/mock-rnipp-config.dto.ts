import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppConfig } from '@fc/app';
import { LoggerConfig } from '@fc/logger';

export class MockRnippConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;
}
