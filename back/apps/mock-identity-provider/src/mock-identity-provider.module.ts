/* istanbul ignore file */

// Declarative code
import { Global, Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { ExceptionsModule } from '@fc/exceptions-deprecated';
import { OidcAcrModule } from '@fc/oidc-acr';
import {
  OidcProviderGrantService,
  OidcProviderModule,
} from '@fc/oidc-provider';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  MockIdentityProviderController,
  OidcProviderController,
} from './controllers';
import {
  MockIdentityProviderService,
  OidcProviderConfigAppService,
  OidcProviderMiddlewareService,
  ScenariosService,
} from './services';

const exceptionModule = ExceptionsModule.withoutTracking();
@Global()
@Module({
  imports: [
    AppModule,
    exceptionModule,
    AsyncLocalStorageModule,
    ServiceProviderAdapterEnvModule,
    SessionModule,
    OidcProviderModule.register(
      OidcProviderConfigAppService,
      ServiceProviderAdapterEnvService,
      ServiceProviderAdapterEnvModule,
      exceptionModule,
    ),
    ViewTemplatesModule,
    OidcAcrModule,
  ],
  controllers: [MockIdentityProviderController, OidcProviderController],
  providers: [
    MockIdentityProviderService,
    OidcProviderConfigAppService,
    OidcProviderGrantService,
    OidcProviderMiddlewareService,
    ScenariosService,
  ],
  exports: [OidcProviderConfigAppService],
})
export class MockIdentityProviderModule {}
