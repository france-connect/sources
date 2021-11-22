/* istanbul ignore file */

// Declarative code

import { Module } from '@nestjs/common';

import { CogModule } from '@fc/cog';

import { EidasToOidcService, OidcToEidasService } from './services';

@Module({
  exports: [EidasToOidcService, OidcToEidasService],
  imports: [CogModule],
  providers: [EidasToOidcService, OidcToEidasService],
})
export class EidasOidcMapperModule {}
