import { Module } from '@nestjs/common';

import { CryptographyService } from './cryptography.service';

@Module({
  providers: [CryptographyService],
  exports: [CryptographyService],
})
export class CryptographyModule {}
