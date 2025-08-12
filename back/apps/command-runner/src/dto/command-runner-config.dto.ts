import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppCliConfig } from '@fc/app';
import { LoggerConfig } from '@fc/logger';

export class CommandRunnerConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppCliConfig)
  readonly App: AppCliConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;
}
