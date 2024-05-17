/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { PartnersController } from './controllers/partners.controller';
import { PartnersService } from './services/partners.service';

@Module({
  providers: [PartnersService],
  controllers: [PartnersController],
  exports: [PartnersService],
})
export class PartnersModule {}
