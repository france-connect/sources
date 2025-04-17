import { Module } from '@nestjs/common';

import { ApacheIgniteModule } from '@fc/apache-ignite';
import { CryptographyModule } from '@fc/cryptography';
/**
 * Import from `/services` to avoid circular dependency
 * (this module is imported in @fc/eidas-bridge)
 */
import { EidasLightProtocolModule } from '@fc/eidas-light-protocol';

import { EidasClientController } from './eidas-client.controller';
import { EidasClientService } from './eidas-client.service';

@Module({
  imports: [ApacheIgniteModule, CryptographyModule, EidasLightProtocolModule],
  providers: [EidasClientService],
  exports: [EidasClientService],
  controllers: [EidasClientController],
})
export class EidasClientModule {}
