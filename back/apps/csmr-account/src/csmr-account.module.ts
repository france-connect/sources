import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AccountModule } from '@fc/account';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule, FcRmqExceptionFilter } from '@fc/exceptions';
import { MongooseModule } from '@fc/mongoose';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrAccountController } from './controllers';

@Module({
  imports: [
    AccountModule,
    AsyncLocalStorageModule,
    ExceptionsModule,
    MongooseModule.forRoot(),
    RabbitmqModule.registerFor('Account'),
  ],
  controllers: [CsmrAccountController],
  providers: [
    FcRmqExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcRmqExceptionFilter,
    },
  ],
})
export class CsmrAccountModule {}
