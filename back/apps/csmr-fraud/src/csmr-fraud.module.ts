/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrFraudController } from './controllers';
import { CsmrFraudService } from './services';

@Module({
  imports: [RabbitmqModule.registerFor('Fraud')],
  controllers: [CsmrFraudController],
  providers: [CsmrFraudService],
})
export class CsmrFraudModule {}
