/* istanbul ignore file */

// Declarative file
import { Global, Module } from '@nestjs/common';

import { CryptographyModule, CryptographyService } from '@fc/cryptography';
import { SessionModule } from '@fc/session';

import { CsrfService } from './services';

@Global()
@Module({
  imports: [CryptographyModule, SessionModule],
  providers: [CsrfService, CryptographyService],
  exports: [CsrfService, CryptographyService],
})
export class CsrfModule {}
