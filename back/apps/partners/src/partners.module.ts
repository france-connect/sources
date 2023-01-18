/* istanbul ignore file */

// Declarative code
import {
  DynamicModule,
  MiddlewareConsumer,
  Module,
  Type,
} from '@nestjs/common';

import {
  AccessControlModule,
  AccessControlSessionMiddleware,
  BasePermissionsHandlerService,
} from '@fc/access-control';
import { AppModule } from '@fc/app';
import { ConfigService } from '@fc/config';
import { ExceptionsModule } from '@fc/exceptions';
import { PartnerAccountModule } from '@fc/partner-account';
import { PartnerServiceProviderModule } from '@fc/partner-service-provider';
import { PartnerServiceProviderConfigurationModule } from '@fc/partner-service-provider-configuration';
import { PostgresModule } from '@fc/postgres';
import { SessionConfig, SessionMiddleware, SessionModule } from '@fc/session';

import {
  AccountController,
  ServiceProviderConfigurationController,
  ServiceProviderController,
} from './controllers';
import { PartnersSession } from './dto';
import { PartnersService } from './services';

@Module({})
export class PartnersModule {
  constructor(private readonly config: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const { excludedRoutes } = this.config.get<SessionConfig>('Session');

    consumer
      .apply(SessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
    consumer
      .apply(AccessControlSessionMiddleware)
      .exclude(...excludedRoutes)
      .forRoutes('*');
  }
  static withAccessControlHandler(
    handler: Type<BasePermissionsHandlerService>,
  ): DynamicModule {
    return {
      module: PartnersModule,
      imports: [
        ExceptionsModule.withoutTracking(),
        AppModule,
        PostgresModule,
        PartnerAccountModule,
        PartnerServiceProviderModule,
        PartnerServiceProviderConfigurationModule,
        SessionModule.forRoot({ schema: PartnersSession }),
        AccessControlModule.withRolesHandler(handler),
      ],
      providers: [PartnersService],
      controllers: [
        AccountController,
        ServiceProviderController,
        ServiceProviderConfigurationController,
      ],
    };
  }
}
