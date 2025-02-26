import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppRmqConfig } from '@fc/app';
import { ExceptionsConfig } from '@fc/exceptions';
import { LoggerConfig } from '@fc/logger';
import { RabbitmqConfig } from '@fc/rabbitmq';

export class CsmrConfigConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppRmqConfig)
  readonly App: AppRmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly ConfigBroker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ExceptionsConfig)
  readonly Exceptions: ExceptionsConfig;
}
