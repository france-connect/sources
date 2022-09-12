/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { ExceptionsModule } from '@fc/exceptions';
import { PartnerAccountModule } from '@fc/partner-account';
import { PartnerServiceProviderModule } from '@fc/partner-service-provider';
import { PostgresModule } from '@fc/postgres';
import { SessionModule } from '@fc/session';

import { AccountController, ServiceProviderController } from './controllers';
import { PartnersSession } from './dto';
import { PartnersService } from './services';

@Module({
  imports: [
    ExceptionsModule,
    AppModule,
    PostgresModule,
    PartnerAccountModule,
    PartnerServiceProviderModule,
    SessionModule.forRoot({ schema: PartnersSession }),
  ],
  providers: [PartnersService],
  controllers: [AccountController, ServiceProviderController],
})
export class PartnersModule {}
