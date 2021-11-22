import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptographyModule } from '@fc/cryptography';

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
  exports: [ServiceProviderAdapterMongoService, MongooseModule],
})
export class ServiceProviderAdapterMongoModule {}
