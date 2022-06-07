/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnerAccountService } from './partner-account.service';
import { PartnerAccountRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PartnerAccountRepository])],
  providers: [PartnerAccountService],
  exports: [PartnerAccountService],
})
export class PartnerAccountModule {}
