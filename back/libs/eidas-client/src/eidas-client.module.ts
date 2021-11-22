/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ApacheIgniteModule } from '@fc/apache-ignite';
import { EidasLightProtocolModule } from '@fc/eidas-light-protocol';

import { EidasClientController } from './eidas-client.controller';
import { EidasClientService } from './eidas-client.service';

@Module({
  imports: [ApacheIgniteModule, EidasLightProtocolModule],
  providers: [EidasClientService],
  exports: [EidasClientService],
  controllers: [EidasClientController],
})
export class EidasClientModule {}
