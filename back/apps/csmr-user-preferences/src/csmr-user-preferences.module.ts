/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ExceptionsModule } from '@fc/exceptions-deprecated';
import { IdentityProviderAdapterMongoModule } from '@fc/identity-provider-adapter-mongo';
import { MongooseModule } from '@fc/mongoose';

import { CsmrUserPreferencesController } from './controllers';
import { CsmrUserPreferenceHandler } from './handlers';
import { CsmrUserPreferencesService } from './services';

@Module({
  imports: [
    ExceptionsModule.withoutTracking(),
    MongooseModule.forRoot(),
    AsyncLocalStorageModule,
    AccountModule,
    CryptographyFcpModule,
    IdentityProviderAdapterMongoModule,
  ],
  controllers: [CsmrUserPreferencesController],
  providers: [CsmrUserPreferencesService, CsmrUserPreferenceHandler],
  exports: [CsmrUserPreferenceHandler],
})
export class CsmrUserPreferencesModule {}
