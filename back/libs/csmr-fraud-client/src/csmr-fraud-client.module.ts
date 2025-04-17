import { Module } from '@nestjs/common';

import {
  getRmqServiceProvider,
  MicroservicesRmqModule,
} from '@fc/microservices-rmq';

import { CsmrFraudClientService } from './services';

const csmrFraudClientProvider = getRmqServiceProvider<CsmrFraudClientService>(
  CsmrFraudClientService,
  'Fraud',
);

@Module({
  imports: [MicroservicesRmqModule.forPublisher('Fraud')],
  providers: [csmrFraudClientProvider],
  exports: [csmrFraudClientProvider],
})
export class CsmrFraudClientModule {}
