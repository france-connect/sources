import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppModule } from '@fc/app';
import { AsyncLocalStorageModule } from '@fc/async-local-storage';
import { CryptographyModule } from '@fc/cryptography';
import { CsrfModule } from '@fc/csrf';
import {
  ExceptionsModule,
  FcWebHtmlExceptionFilter,
  HttpExceptionFilter,
  UnknownHtmlExceptionFilter,
} from '@fc/exceptions';
import { HttpProxyModule } from '@fc/http-proxy';
import {
  IdentityProviderAdapterEnvModule,
  IdentityProviderAdapterEnvService,
} from '@fc/identity-provider-adapter-env';
import { OidcClientModule } from '@fc/oidc-client';
import {
  ServiceProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
} from '@fc/service-provider-adapter-env';
import { SessionModule } from '@fc/session';
import { ViewTemplatesModule } from '@fc/view-templates';

import {
  MockServiceProviderController,
  OidcClientController,
} from './controllers';
import { AuthExceptionFilter } from './filters';
import { AppModeInterceptor } from './interceptors';
import { MockServiceProviderService } from './services';

const oidcClientModule = OidcClientModule.register(
  IdentityProviderAdapterEnvService,
  IdentityProviderAdapterEnvModule,
  ServiceProviderAdapterEnvService,
  ServiceProviderAdapterEnvModule,
);

@Global()
@Module({
  imports: [
    AppModule,
    AsyncLocalStorageModule,
    ExceptionsModule,
    SessionModule,
    IdentityProviderAdapterEnvModule,
    CryptographyModule,
    oidcClientModule,
    HttpModule,
    HttpProxyModule,
    ViewTemplatesModule,
    CsrfModule,
  ],
  controllers: [OidcClientController, MockServiceProviderController],
  providers: [
    MockServiceProviderService,
    { provide: APP_INTERCEPTOR, useClass: AppModeInterceptor },
    FcWebHtmlExceptionFilter,

    {
      provide: APP_FILTER,
      useClass: UnknownHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: FcWebHtmlExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AuthExceptionFilter,
    },
  ],
})
export class MockServiceProviderModule {}
