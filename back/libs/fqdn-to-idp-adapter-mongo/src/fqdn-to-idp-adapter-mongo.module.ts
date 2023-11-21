/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { MongooseModule } from '@fc/mongoose';

import { FqdnToIdentityProviderSchema } from './schemas';
import { FqdnToIdpAdapterMongoService } from './service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'FqdnToIdentityProvider',
        schema: FqdnToIdentityProviderSchema,
      },
    ]),
  ],
  providers: [FqdnToIdpAdapterMongoService],
  exports: [FqdnToIdpAdapterMongoService],
})
export class FqdnToIdpAdapterMongoModule {}
