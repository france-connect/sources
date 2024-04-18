import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
  IsEqualToConfigConstraint,
  IsUrlRequiredTldFromConfigConstraint,
} from '@fc/common';
import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';

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
  providers: [
    ServiceProviderAdapterMongoService,
    IsEqualToConfigConstraint,
    IsUrlRequiredTldFromConfigConstraint,
  ],
  exports: [ServiceProviderAdapterMongoService],
})
export class ServiceProviderAdapterMongoModule {}
