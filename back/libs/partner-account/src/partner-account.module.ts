/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from '@entities/typeorm';

import { PartnerAccountService } from './partner-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [PartnerAccountService],
  exports: [PartnerAccountService],
})
export class PartnerAccountModule {}
