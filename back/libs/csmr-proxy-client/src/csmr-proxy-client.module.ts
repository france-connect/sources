import { Module } from '@nestjs/common';

import {
  getRmqServiceProvider,
  MicroservicesRmqModule,
} from '@fc/microservices-rmq';

import { CsmrProxyClientService } from './services';

const csmrProxyClientProvider = getRmqServiceProvider<CsmrProxyClientService>(
  CsmrProxyClientService,
  'Proxy',
);

@Module({
  imports: [MicroservicesRmqModule.forPublisher('Proxy')],
  providers: [csmrProxyClientProvider],
  exports: [csmrProxyClientProvider],
})
export class CsmrProxyClientModule {}
