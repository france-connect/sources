/* istanbul ignore file */

// declarative file
import { Module } from '@nestjs/common';

import { RabbitmqModule } from '@fc/rabbitmq';

import { CsmrFraudClientService } from './services';

@Module({
  imports: [RabbitmqModule.registerFor('Fraud')],
  providers: [CsmrFraudClientService],
  exports: [CsmrFraudClientService],
})
export class CsmrFraudClientModule {}
