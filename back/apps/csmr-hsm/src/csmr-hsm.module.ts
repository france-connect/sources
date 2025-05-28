import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule, FcRmqExceptionFilter } from '@fc/exceptions';
import { HsmModule } from '@fc/hsm';
import { MicroservicesRmqModule } from '@fc/microservices-rmq';

import { CsmrHsmController } from './csmr-hsm.controller';

@Module({
  imports: [
    ExceptionsModule,
    HsmModule,
    AsyncLocalStorageModule,
    MicroservicesRmqModule.forSubscriber(),
  ],
  controllers: [CsmrHsmController],
  providers: [
    FcRmqExceptionFilter,
    {
      provide: APP_FILTER,
      useClass: FcRmqExceptionFilter,
    },
  ],
})
export class CsmrHsmModule {}
