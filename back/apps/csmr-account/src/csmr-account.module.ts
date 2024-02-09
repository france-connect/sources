/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule } from '@fc/exceptions';
import { MongooseModule } from '@fc/mongoose';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrAccountController } from './controllers';

@Module({
  imports: [
    AccountModule,
    AsyncLocalStorageModule,
    ExceptionsModule.withoutTracking(),
    MongooseModule.forRoot(),
    RabbitmqModule.registerFor('Account'),
  ],
  controllers: [CsmrAccountController],
})
export class CsmrAccountModule {}
