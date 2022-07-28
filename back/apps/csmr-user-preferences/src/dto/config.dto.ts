/* istanbul ignore file */

// Declarative code
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { IdentityProviderAdapterMongoConfig } from '@fc/identity-provider-adapter-mongo';
import { LoggerConfig } from '@fc/logger-legacy';
import { MongooseConfig } from '@fc/mongoose';
import { RabbitmqConfig } from '@fc/rabbitmq';

import { AppConfig } from './app-config.dto';

export class CsmrUserPreferencesConfig {
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
  @Type(() => RabbitmqConfig)
  readonly Broker: RabbitmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MongooseConfig)
  readonly Mongoose: MongooseConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => IdentityProviderAdapterMongoConfig)
  readonly IdentityProviderAdapterMongo: IdentityProviderAdapterMongoConfig;
}
