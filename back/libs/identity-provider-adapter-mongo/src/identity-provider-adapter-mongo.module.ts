import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';

import { CryptographyModule } from '@fc/cryptography';

import { IdentityProviderUpdateHandler } from './handlers';
import { IdentityProviderAdapterMongoService } from './identity-provider-adapter-mongo.service';
import { IdentityProviderSchema } from './schemas';

@Module({
  imports: [
    CryptographyModule,
    MongooseModule.forFeature([
      { name: 'IdentityProvider', schema: IdentityProviderSchema },
    ]),
    CqrsModule,
  ],
  providers: [
    IdentityProviderAdapterMongoService,
    IdentityProviderUpdateHandler,
  ],
  exports: [IdentityProviderAdapterMongoService, MongooseModule],
})
export class IdentityProviderAdapterMongoModule {}
