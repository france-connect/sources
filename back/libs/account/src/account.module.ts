import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AccountSchema } from './schemas';
import { AccountService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
  ],
  providers: [AccountService],
  exports: [AccountService, MongooseModule],
})
export class AccountModule {}
