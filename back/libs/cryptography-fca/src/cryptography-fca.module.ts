/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyModule, CryptographyService } from '@fc/cryptography';

import { CryptographyFcaService } from './cryptography-fca.service';

@Module({
  imports: [CryptographyModule],
  providers: [CryptographyFcaService, CryptographyService],
  exports: [CryptographyFcaService],
})
export class CryptographyFcaModule {}
