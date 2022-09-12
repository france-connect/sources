/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Organisation } from '@entities/typeorm';

import { PartnerOrganisationService } from './partner-organisation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Organisation])],
  providers: [PartnerOrganisationService],
  exports: [PartnerOrganisationService],
})
export class PartnerOrganisationModule {}
