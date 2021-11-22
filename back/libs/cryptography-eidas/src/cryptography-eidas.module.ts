/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { CryptographyEidasService } from './cryptography-eidas.service';

@Module({
  providers: [CryptographyEidasService],
  exports: [CryptographyEidasService],
})
export class CryptographyEidasModule {}
