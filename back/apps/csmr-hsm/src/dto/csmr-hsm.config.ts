import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppRmqConfig } from '@fc/app';
import { HsmConfig } from '@fc/hsm';
import { LoggerConfig } from '@fc/logger';
import { LoggerConfig as LoggerLegacyConfig } from '@fc/logger-legacy';
import { RabbitmqConfig } from '@fc/rabbitmq';

export class CsmrHsmConfig {
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
  @Type(() => LoggerLegacyConfig)
  readonly LoggerLegacy: LoggerLegacyConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => HsmConfig)
  readonly Hsm: HsmConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly CryptographyBroker: RabbitmqConfig;
}
