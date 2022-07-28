import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';

import { ServiceProviderUpdateHandler } from './handlers/service-provider-update.handlers';
import { ServiceProviderSchema } from './schemas';
import { ServiceProviderAdapterMongoService } from './service-provider-adapter-mongo.service';

@Module({
  imports: [
    CryptographyModule,
    MongooseModule.forFeature([
      { name: 'ServiceProvider', schema: ServiceProviderSchema },
    ]),
    CqrsModule,
  ],
  providers: [ServiceProviderAdapterMongoService, ServiceProviderUpdateHandler],
  exports: [ServiceProviderAdapterMongoService],
})
export class ServiceProviderAdapterMongoModule {}
