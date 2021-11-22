/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { OidcProviderModule } from '@fc/oidc-provider';
import { RabbitmqModule } from '@fc/rabbitmq';

import { CryptoOverrideService, OverrideOidcProviderService } from './services';

@Module({
  imports: [OidcProviderModule, RabbitmqModule.registerFor('Cryptography')],
  providers: [OverrideOidcProviderService, CryptoOverrideService],
  exports: [OverrideOidcProviderService],
})
export class OverrideOidcProviderModule {}
