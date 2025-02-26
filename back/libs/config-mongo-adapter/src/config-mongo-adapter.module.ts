import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';
import { ServiceProviderModule } from '@fc/service-provider';
import { ServiceProviderSchema } from '@fc/service-provider-adapter-mongo';

import { ConfigMongoAdapterService } from './services';

const MongooseModel = MongooseModule.forFeature([
  { name: 'ServiceProvider', schema: ServiceProviderSchema },
]);
@Module({
  imports: [CryptographyModule, MongooseModel, ServiceProviderModule],
  providers: [ConfigMongoAdapterService],
  exports: [
    ConfigMongoAdapterService,
    CryptographyModule,
    MongooseModel,
    ServiceProviderModule,
  ],
})
export class ConfigMongoAdapterModule {}
