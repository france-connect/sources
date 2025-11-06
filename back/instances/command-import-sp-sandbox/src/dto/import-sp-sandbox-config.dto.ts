import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { LoggerConfig } from '@fc/logger';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { MongooseConfig } from '@fc/mongoose';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';
import { WebhooksConfig } from '@fc/webhooks';

import { WEBHOOK_NAME } from '../constants';
import { AppCliConfig } from './app-cli-config.dto';

export class ImportSpSandboxConfig {
  @IsObject()
  @ValidateNested()
  @Type(() => AppCliConfig)
  readonly App: AppCliConfig;

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
  @Type(() => ServiceProviderAdapterMongoConfig)
  readonly ServiceProviderAdapterMongo: ServiceProviderAdapterMongoConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MicroservicesRmqConfig)
  readonly ConfigSandboxLowMicroService: MicroservicesRmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => WebhooksConfig)
  readonly [WEBHOOK_NAME]: WebhooksConfig;
}
