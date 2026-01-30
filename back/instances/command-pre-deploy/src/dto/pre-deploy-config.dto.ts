import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { LoggerConfig } from '@fc/logger';

import { AppCliConfig } from './app-cli-config.dto';

export class PreDeployConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppCliConfig)
  readonly App: AppCliConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;
}
