import { Module } from '@nestjs/common';

import { MongooseModule } from '@fc/mongoose';

import { AccountSchema } from './schemas';
import { AccountService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Account', schema: AccountSchema }]),
  ],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
