/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AppModule } from '@fc/app';
import { PartnerAccountModule } from '@fc/partner-account';
import { PostgresModule } from '@fc/postgres';
import { SessionModule } from '@fc/session';

import { AccountController } from './controllers';
import { PartnersSession } from './dto';
import { PartnersService } from './services';

@Module({
  imports: [
    AppModule,
    PostgresModule,
    PartnerAccountModule,
    SessionModule.forRoot({ schema: PartnersSession }),
  ],
  providers: [PartnersService],
  controllers: [AccountController],
})
export class PartnersModule {}
