/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ApacheIgniteModule } from '@fc/apache-ignite';
import { EidasLightProtocolModule } from '@fc/eidas-light-protocol';

import { EidasProviderController } from './eidas-provider.controller';
import { EidasProviderService } from './eidas-provider.service';

@Module({
  imports: [ApacheIgniteModule, EidasLightProtocolModule],
  providers: [EidasProviderService],
  exports: [EidasProviderService],
  controllers: [EidasProviderController],
})
export class EidasProviderModule {}
