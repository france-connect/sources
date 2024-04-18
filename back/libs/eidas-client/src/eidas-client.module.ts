/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ApacheIgniteModule } from '@fc/apache-ignite';
import { CryptographyModule } from '@fc/cryptography';
/**
 * Import from `/services` to avoid circular dependency
 * (this module is imported in @fc/eidas-bridge)
 */
import { EidasBridgeTrackingService } from '@fc/eidas-bridge/services';
import { EidasLightProtocolModule } from '@fc/eidas-light-protocol';
import { TrackingModule } from '@fc/tracking';

import { EidasClientController } from './eidas-client.controller';
import { EidasClientService } from './eidas-client.service';

const trackingModule = TrackingModule.forRoot(EidasBridgeTrackingService);

@Module({
  imports: [
    ApacheIgniteModule,
    CryptographyModule,
    EidasLightProtocolModule,
    trackingModule,
  ],
  providers: [EidasClientService],
  exports: [EidasClientService],
  controllers: [EidasClientController],
})
export class EidasClientModule {}
