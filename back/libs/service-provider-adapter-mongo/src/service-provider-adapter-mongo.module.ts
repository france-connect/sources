import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import {
  IsEqualToConfigConstraint,
  IsIncludedInConfigConstraint,
  IsUrlRequiredTldFromConfigConstraint,
} from '@fc/common';
import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';
import { MongooseChangeStreamModule } from '@fc/mongoose-change-stream';

import { ServiceProviderSchema } from './schemas';
import { ServiceProviderAdapterMongoService } from './services';

@Module({
  imports: [
    CryptographyModule,
    MongooseModule.forFeature([
      { name: 'ServiceProvider', schema: ServiceProviderSchema },
    ]),
    MongooseChangeStreamModule,
    CqrsModule,
  ],
  providers: [
    ServiceProviderAdapterMongoService,
    IsEqualToConfigConstraint,
    IsIncludedInConfigConstraint,
    IsUrlRequiredTldFromConfigConstraint,
  ],
  exports: [ServiceProviderAdapterMongoService],
})
export class ServiceProviderAdapterMongoModule {}
