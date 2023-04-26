/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { OidcAcrModule } from '@fc/oidc-acr';
import { OidcProviderModule } from '@fc/oidc-provider';
import { ServiceProviderAdapterMongoModule } from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import {
  CoreAccountService,
  CoreOidcProviderMiddlewareService,
  CoreTrackingService,
  CoreVerifyService,
} from './services';
import { CoreAcrService } from './services/core-acr.service';

const trackingModule = TrackingModule.forRoot(CoreTrackingService);

@Module({
  imports: [
    ServiceProviderAdapterMongoModule,
    SessionModule,
    OidcAcrModule,
    /** Inject app specific tracking service */
    trackingModule,
    OidcProviderModule,
    AccountModule,
  ],
  providers: [
    CoreAccountService,
    CoreTrackingService,
    CoreOidcProviderMiddlewareService,
    CoreAcrService,
    CoreVerifyService,
  ],
  exports: [
    CoreAccountService,
    CoreTrackingService,
    CoreOidcProviderMiddlewareService,
    CoreAcrService,
    CoreVerifyService,
  ],
})
export class CoreModule {}
