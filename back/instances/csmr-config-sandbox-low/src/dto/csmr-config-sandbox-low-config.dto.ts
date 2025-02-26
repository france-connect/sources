import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CsmrConfigConfig } from '@fc/csmr-config';
import { MicroservicesRmqConfig } from '@fc/microservices-rmq';
import { MongooseConfig } from '@fc/mongoose';
import { ServiceProviderAdapterMongoConfig } from '@fc/service-provider-adapter-mongo';

export class CsmrConfigSandboxLowConfig extends CsmrConfigConfig {
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
  readonly ConfigPartnersMicroService: MicroservicesRmqConfig;
}
