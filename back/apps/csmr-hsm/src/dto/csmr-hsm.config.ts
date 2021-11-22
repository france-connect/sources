/* istanbul ignore file */

import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { HsmConfig } from '@fc/hsm';
import { LoggerConfig } from '@fc/logger';
import { RabbitmqConfig } from '@fc/rabbitmq';

export class CsmrHsmConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => HsmConfig)
  readonly Hsm: HsmConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly CryptographyBroker: RabbitmqConfig;
}
