import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { ExceptionsConfig } from '@fc/exceptions/dto';
import { LoggerConfig } from '@fc/logger';
import { WebhooksConfig } from '@fc/webhooks';

import { AppConfig } from './app-config.dto';

export class MockDatapassConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppConfig)
  readonly App: AppConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ExceptionsConfig)
  readonly Exceptions: ExceptionsConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => WebhooksConfig)
  readonly WebhooksDatapass: WebhooksConfig;
}
