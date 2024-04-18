/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule } from '@fc/exceptions-deprecated';
import { HsmModule } from '@fc/hsm';

import { CsmrHsmController } from './csmr-hsm.controller';

@Module({
  imports: [
    ExceptionsModule.withoutTracking(),
    HsmModule,
    AsyncLocalStorageModule,
  ],
  controllers: [CsmrHsmController],
})
export class CsmrHsmModule {}
