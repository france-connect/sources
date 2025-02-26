import { DynamicModule, Module } from '@nestjs/common';

import {
  getRmqServiceProvider,
  MicroservicesRmqModule,
} from '@fc/microservices-rmq';

import { getServiceToken } from './helpers';
import { CsmrConfigClientService } from './services';

@Module({})
export class CsmrConfigClientModule {
  static registerFor(target: string): DynamicModule {
    const serviceName = getServiceToken(target);

    const csmrConfigClientProvider =
      getRmqServiceProvider<CsmrConfigClientService>(
        CsmrConfigClientService,
        serviceName,
      );

    return {
      module: CsmrConfigClientModule,
      imports: [MicroservicesRmqModule.forPublisher(serviceName)],
      providers: [csmrConfigClientProvider],
      exports: [csmrConfigClientProvider],
    };
  }
}
