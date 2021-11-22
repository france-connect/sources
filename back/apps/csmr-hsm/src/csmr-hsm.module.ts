/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ExceptionsModule } from '@fc/exceptions';
import { HsmModule } from '@fc/hsm';

import { CsmrHsmController } from './csmr-hsm.controller';

@Module({
  imports: [ExceptionsModule, HsmModule],
  controllers: [CsmrHsmController],
})
export class CsmrHsmModule {}
