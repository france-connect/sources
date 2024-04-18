import { Module } from '@nestjs/common';

import { CryptographyModule, CryptographyService } from '@fc/cryptography';

import { CryptographyFcpService } from './cryptography-fcp.service';

@Module({
  imports: [CryptographyModule],
  providers: [CryptographyFcpService, CryptographyService],
  exports: [CryptographyFcpService],
})
export class CryptographyFcpModule {}
