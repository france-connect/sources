// Stryker disable all
/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { LoggerConfig } from '@fc/logger-legacy';
import { MongooseConfig } from '@fc/mongoose';
import { RabbitmqConfig } from '@fc/rabbitmq';

export class CsmrAccountConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => LoggerConfig)
  readonly Logger: LoggerConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MongooseConfig)
  readonly Mongoose: MongooseConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => RabbitmqConfig)
  readonly AccountBroker: RabbitmqConfig;
}
