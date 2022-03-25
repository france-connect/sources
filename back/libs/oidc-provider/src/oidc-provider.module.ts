import { DynamicModule, Module, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { CqrsModule } from '@nestjs/cqrs';

import { FcExceptionFilter } from '@fc/exceptions';
import { IServiceProviderAdapter } from '@fc/oidc';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc/tokens';
import { RedisModule } from '@fc/redis';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import { IOidcProviderConfigAppService } from './interfaces';
import { OidcProviderController } from './oidc-provider.controller';
import { OidcProviderService } from './oidc-provider.service';
import { OidcProviderConfigService } from './services/oidc-provider-config.service';
import { OidcProviderErrorService } from './services/oidc-provider-error.service';
import { OidcProviderGrantService } from './services/oidc-provider-grant.service';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';
import { IsValidPromptConstraint } from './validators';

@Module({})
export class OidcProviderModule {
  /**
   * Declare a dynamic module in order to be able to inject whichever
   * identity service we wish.
   * This kind of injection can not be done statically.
   * @see https://docs.nestjs.com/fundamentals/custom-providers
   */
  // does not need to be tested
  // istanbul ignore next
  static register(
    OidcProviderConfigApp: Type<IOidcProviderConfigAppService>,
    serviceProviderClass: Type<IServiceProviderAdapter>,
    serviceProviderModule: Type<ModuleMetadata>,
  ): DynamicModule {
    const serviceProviderProvider = {
      provide: SERVICE_PROVIDER_SERVICE_TOKEN,
      useExisting: serviceProviderClass,
    };

    const oidcProviderConfigApp = {
      provide: OIDC_PROVIDER_CONFIG_APP_TOKEN,
      useExisting: OidcProviderConfigApp,
    };

    return {
      module: OidcProviderModule,
      imports: [
        RedisModule,
        TrackingModule.forLib(),
        serviceProviderModule,
        CqrsModule,
        SessionModule,
      ],
      providers: [
        FcExceptionFilter,
        oidcProviderConfigApp,
        serviceProviderProvider,
        OidcProviderService,
        IsValidPromptConstraint,
        OidcProviderErrorService,
        OidcProviderConfigService,
        OidcProviderGrantService,
      ],
      exports: [
        OidcProviderService,
        RedisModule,
        oidcProviderConfigApp,
        serviceProviderProvider,
        FcExceptionFilter,
        OidcProviderErrorService,
      ],
      controllers: [OidcProviderController],
    };
  }
}
