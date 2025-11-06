import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';
import { MongooseModule } from '@fc/mongoose';
import { MongooseChangeStreamModule } from '@fc/mongoose-change-stream';

import { IdentityProviderSchema } from './schemas';
import { IdentityProviderAdapterMongoService } from './services';

@Module({
  imports: [
    CryptographyModule,
    MongooseModule.forFeature([
      { name: 'IdentityProvider', schema: IdentityProviderSchema },
    ]),
    MongooseChangeStreamModule,
  ],
  providers: [IdentityProviderAdapterMongoService],
  exports: [IdentityProviderAdapterMongoService],
})
export class IdentityProviderAdapterMongoModule {}
