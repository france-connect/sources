import { Module } from '@nestjs/common';

import { CryptographyService } from '@fc/cryptography';

import { CryptographyFcpService } from './cryptography-fcp.service';

@Module({
  imports: [CryptographyService],
  providers: [CryptographyFcpService, CryptographyService],
  exports: [CryptographyFcpService],
})
export class CryptographyFcpModule {}
