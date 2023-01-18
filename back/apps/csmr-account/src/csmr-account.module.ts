/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { ExceptionsModule } from '@fc/exceptions';
import { LoggerModule } from '@fc/logger-legacy';
import { MongooseModule } from '@fc/mongoose';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrAccountController } from './controllers';

@Module({
  imports: [
    AccountModule,
    ExceptionsModule.withoutTracking(),
    LoggerModule,
    MongooseModule.forRoot(),
    RabbitmqModule.registerFor('Account'),
  ],
  controllers: [CsmrAccountController],
})
export class CsmrAccountModule {}
