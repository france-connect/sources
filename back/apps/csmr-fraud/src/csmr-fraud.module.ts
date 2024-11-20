/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule } from '@fc/exceptions';
import { MailerModule } from '@fc/mailer';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrFraudController } from './controllers';
import { CsmrFraudDataService, CsmrFraudSupportService } from './services';

@Module({
  imports: [
    RabbitmqModule.registerFor('Fraud'),
    MailerModule,
    AsyncLocalStorageModule,
    ExceptionsModule,
  ],
  controllers: [CsmrFraudController],
  providers: [CsmrFraudSupportService, CsmrFraudDataService],
})
export class CsmrFraudModule {}
