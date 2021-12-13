/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { DataProviderCoreAuthConfig } from '@fc/data-provider-core-auth';
import { LoggerConfig } from '@fc/logger';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppConfig } from './app-config.dto';

export class TracksDataProviderConfig {
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
  @Type(() => DataProviderCoreAuthConfig)
  readonly DataProviderCoreAuth: DataProviderCoreAuthConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly TracksBroker: RabbitmqConfig;
}
