/* istanbul ignore file */

// Declarative file
import { Module } from '@nestjs/common';

import { OidcAcrService } from './oidc-acr.service';

@Module({
  providers: [OidcAcrService],
  exports: [OidcAcrService],
})
export class OidcAcrModule {}
