/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyFcaService } from './cryptography-fca.service';

@Module({
  providers: [CryptographyFcaService],
  exports: [CryptographyFcaService],
})
export class CryptographyFcaModule {}
