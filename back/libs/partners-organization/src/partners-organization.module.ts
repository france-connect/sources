import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersOrganization } from '@entities/typeorm';

import { PartnersOrganizationService } from './services/partners-organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersOrganization])],
  providers: [PartnersOrganizationService],
  exports: [PartnersOrganizationService],
})
export class PartnersOrganizationModule {}
