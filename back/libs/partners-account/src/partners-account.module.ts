import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartnersAccount } from '@entities/typeorm';

import { PartnersAccountService } from './services/partners-account.service';

@Module({
  imports: [TypeOrmModule.forFeature([PartnersAccount])],
  providers: [PartnersAccountService],
  exports: [PartnersAccountService],
})
export class PartnersAccountModule {}
