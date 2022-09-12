/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Datapass } from '@entities/typeorm';

import { PartnerDatapassService } from './partner-datapass.service';

@Module({
  imports: [TypeOrmModule.forFeature([Datapass])],
  providers: [PartnerDatapassService],
  exports: [PartnerDatapassService],
})
export class PartnerDatapassModule {}
