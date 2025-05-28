import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { AppRmqConfig } from '@fc/app';
import { LoggerConfig } from '@fc/logger';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { MongooseConfig } from '@fc/mongoose';
import { ScopesConfig } from '@fc/scopes';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';

import { DefaultServiceProviderLowValueConfig } from './default-service-provider-value.dto';

export class CsmrImportCoreConfig {
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
  @Type(() => MicroservicesRmqConfig)
  readonly ImportCoreBroker: MicroservicesRmqConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => MicroservicesRmqConfig)
  readonly CsmrHsmClientMicroService: MicroservicesRmqConfig;

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
  @Type(() => DefaultServiceProviderLowValueConfig)
  readonly DefaultServiceProviderLowValue: DefaultServiceProviderLowValueConfig;

  @IsObject()
  @ValidateNested()
  @Type(() => ScopesConfig)
  readonly ScopesFcpLow: ScopesConfig;
}
