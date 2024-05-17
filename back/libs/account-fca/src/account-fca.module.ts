/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { MongooseModule } from '@fc/mongoose';

import { AccountFcaSchema } from './schemas';
import { AccountFcaService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AccountFca', schema: AccountFcaSchema },
    ]),
  ],
  providers: [AccountFcaService],
  exports: [AccountFcaService],
})
export class AccountFcaModule {}
