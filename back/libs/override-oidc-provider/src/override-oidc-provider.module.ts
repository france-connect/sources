import { Module } from '@nestjs/common';

import { CsmrHsmClientModule } from '@fc/csmr-hsm-client';
import { OidcProviderModule } from '@fc/oidc-provider';

import { CryptoOverrideService, OverrideOidcProviderService } from './services';

@Module({
  imports: [OidcProviderModule, CsmrHsmClientModule],
  providers: [OverrideOidcProviderService, CryptoOverrideService],
  exports: [OverrideOidcProviderService],
})
export class OverrideOidcProviderModule {}
