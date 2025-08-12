import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule, FcRmqExceptionFilter } from '@fc/exceptions';
import { HsmModule } from '@fc/hsm';
import { MicroservicesRmqModule } from '@fc/microservices-rmq';

import { CsmrHsmController_v1, CsmrHsmController_v2 } from './controllers';

@Module({
  imports: [
    AppModule,
    ExceptionsModule,
    HsmModule,
    AsyncLocalStorageModule,
    MicroservicesRmqModule.forSubscriber(),
  ],
  controllers: [CsmrHsmController_v1, CsmrHsmController_v2],
  providers: [
    FcRmqExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcRmqExceptionFilter,
    },
  ],
})
export class CsmrHsmModule {}
