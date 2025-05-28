import { Module } from '@nestjs/common';

import {
  getRmqServiceProvider,
  MicroservicesRmqModule,
} from '@fc/microservices-rmq';

import { CsmrHsmClientService } from './services';

const csmrHsmClientProvider = getRmqServiceProvider<CsmrHsmClientService>(
  CsmrHsmClientService,
  'CsmrHsmClient',
);

@Module({
  imports: [MicroservicesRmqModule.forPublisher('CsmrHsmClient')],
  providers: [csmrHsmClientProvider],
  exports: [csmrHsmClientProvider],
})
export class CsmrHsmClientModule {}
