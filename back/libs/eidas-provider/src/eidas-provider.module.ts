import { Module } from '@nestjs/common';

import { ApacheIgniteModule } from '@fc/apache-ignite';
/**
 * Import from `/services` to avoid circular dependency
 * (this module is imported in @fc/eidas-bridge)
 */
import { CryptographyModule } from '@fc/cryptography';
import { EidasLightProtocolModule } from '@fc/eidas-light-protocol';

import { EidasProviderController } from './eidas-provider.controller';
import { EidasProviderService } from './eidas-provider.service';

@Module({
  imports: [ApacheIgniteModule, CryptographyModule, EidasLightProtocolModule],
  providers: [EidasProviderService],
  exports: [EidasProviderService],
  controllers: [EidasProviderController],
})
export class EidasProviderModule {}
