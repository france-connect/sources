import { DynamicModule, Module, ModuleMetadata, Type } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { AccountModule } from '@fc/account';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { FlowStepsModule } from '@fc/flow-steps';
import { OidcAcrModule } from '@fc/oidc-acr';
import { OidcProviderModule } from '@fc/oidc-provider';
import {
  OidcProviderRedirectExceptionFilter,
  OidcProviderRenderedHtmlExceptionFilter,
  OidcProviderRenderedJsonExceptionFilter,
} from '@fc/oidc-provider/filters';
import { ExceptionOccurredHandler } from '@fc/oidc-provider/handlers';
import { ServiceProviderAdapterMongoModule } from '@fc/service-provider-adapter-mongo';
import { SessionModule } from '@fc/session';
import { AppTrackingServiceAbstract, TrackingModule } from '@fc/tracking';

import { CoreServiceInterface } from './interfaces';
import {
  CoreAccountService,
  CoreAuthorizationService,
  CoreOidcProviderConfigAppService,
  CoreOidcProviderMiddlewareService,
  CoreVerifyService,
} from './services';
import { CoreAcrService } from './services/core-acr.service';
import { CORE_SERVICE } from './tokens';

@Module({})
export class CoreModule {
  // More than 4 parameters authorized for dependency injection
  // eslint-disable-next-line max-params
  static register(
    CoreServiceInterface: Type<CoreServiceInterface>,
    oidcProviderModule,
    oidcClientModule,
    IdentityProviderAdapterMongoModule: Type<ModuleMetadata>,
    AppCoreTrackingService: Type<AppTrackingServiceAbstract>,
  ): DynamicModule {
    const trackingModule = TrackingModule.forRoot(AppCoreTrackingService);

    return {
      module: CoreModule,
      imports: [
        ExceptionsModule,
        FlowStepsModule,
        ServiceProviderAdapterMongoModule,
        SessionModule,
        OidcAcrModule,
        OidcProviderModule,
        AccountModule,
        oidcProviderModule,
        oidcClientModule,
        IdentityProviderAdapterMongoModule,
        trackingModule,
      ],
      providers: [
        CoreAccountService,
        CoreOidcProviderConfigAppService,
        {
          provide: CORE_SERVICE,
          useExisting: CoreServiceInterface,
        },
        CoreOidcProviderMiddlewareService,
        CoreAcrService,
        CoreVerifyService,
        CoreAuthorizationService,
        ExceptionOccurredHandler,
        UnknownHtmlExceptionFilter,
        OidcProviderRenderedHtmlExceptionFilter,
        OidcProviderRenderedJsonExceptionFilter,
        OidcProviderRedirectExceptionFilter,
        FcWebHtmlExceptionFilter,
        HttpExceptionFilter,
        {
          provide: APP_FILTER,
          useClass: UnknownHtmlExceptionFilter,
        },
        {
          provide: APP_FILTER,
          useClass: OidcProviderRenderedHtmlExceptionFilter,
        },
        {
          provide: APP_FILTER,
          useClass: OidcProviderRedirectExceptionFilter,
        },
        {
          provide: APP_FILTER,
          useClass: FcWebHtmlExceptionFilter,
        },
        {
          provide: APP_FILTER,
          useClass: HttpExceptionFilter,
        },
      ],
      exports: [
        CoreAccountService,
        CoreOidcProviderMiddlewareService,
        CoreAcrService,
        CoreVerifyService,
        CoreOidcProviderConfigAppService,
        trackingModule,
        CoreAuthorizationService,
      ],
    };
  }
}
