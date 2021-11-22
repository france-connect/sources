import { DynamicModule, Module, Type } from '@nestjs/common';
import { ModuleMetadata } from '@nestjs/common/interfaces';
import { CqrsModule } from '@nestjs/cqrs';

import { FcExceptionFilter } from '@fc/exceptions';
import { IServiceProviderAdapter } from '@fc/oidc';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc/tokens';
import { RedisModule } from '@fc/redis';
import { SessionModule } from '@fc/session';
import { TrackingModule } from '@fc/tracking';

import { OidcProviderController } from './oidc-provider.controller';
import { OidcProviderService } from './oidc-provider.service';
import { OidcProviderConfigService } from './services/oidc-provider-config.service';
import { OidcProviderErrorService } from './services/oidc-provider-error.service';
import { OidcProviderGrantService } from './services/oidc-provider-grant.service';
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
    serviceProviderClass: Type<IServiceProviderAdapter>,
    serviceProviderModule: Type<ModuleMetadata>,
  ): DynamicModule {
    const serviceProviderProvider = {
      provide: SERVICE_PROVIDER_SERVICE_TOKEN,
      useExisting: serviceProviderClass,
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
        serviceProviderProvider,
        FcExceptionFilter,
        OidcProviderErrorService,
      ],
      controllers: [OidcProviderController],
    };
  }
}
