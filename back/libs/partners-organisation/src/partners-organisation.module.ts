import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersOrganisation } from '@entities/typeorm';

import { PartnersOrganisationService } from './services/partners-organisation.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersOrganisation])],
  providers: [PartnersOrganisationService],
  exports: [PartnersOrganisationService],
})
export class PartnersOrganisationModule {}
