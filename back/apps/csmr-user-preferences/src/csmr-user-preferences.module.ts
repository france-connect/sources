/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AccountModule } from '@fc/account';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ExceptionsModule, FcRmqExceptionFilter } from '@fc/exceptions';
import { IdentityProviderAdapterMongoModule } from '@fc/identity-provider-adapter-mongo';
import { MongooseModule } from '@fc/mongoose';

import { CsmrUserPreferencesController } from './controllers';
import { CsmrUserPreferenceHandler } from './handlers';
import { CsmrUserPreferencesService } from './services';

@Module({
  imports: [
    ExceptionsModule,
    MongooseModule.forRoot(),
    AsyncLocalStorageModule,
    AccountModule,
    CryptographyFcpModule,
    IdentityProviderAdapterMongoModule,
  ],
  controllers: [CsmrUserPreferencesController],
  providers: [
    CsmrUserPreferencesService,
    CsmrUserPreferenceHandler,
    FcRmqExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcRmqExceptionFilter,
    },
  ],
  exports: [CsmrUserPreferenceHandler],
})
export class CsmrUserPreferencesModule {}
