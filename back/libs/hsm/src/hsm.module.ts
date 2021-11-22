/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { HsmService } from './hsm.service';

@Module({
  providers: [HsmService],
  exports: [HsmService],
})
export class HsmModule {}
