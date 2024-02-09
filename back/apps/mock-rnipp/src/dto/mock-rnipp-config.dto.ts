/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, IsUrl, ValidateNested } from 'class-validator';

import { AppConfig } from '@fc/app';
import { LoggerConfig } from '@fc/logger';

export class Core {
  @IsUrl()
  readonly defaultRedirectUri: string;
}

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
