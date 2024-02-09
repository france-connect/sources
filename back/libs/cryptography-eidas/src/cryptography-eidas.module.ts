/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyModule } from '@fc/cryptography';

import { CryptographyEidasService } from './cryptography-eidas.service';

@Module({
  imports: [CryptographyModule],
  providers: [CryptographyEidasService],
  exports: [CryptographyEidasService],
})
export class CryptographyEidasModule {}
