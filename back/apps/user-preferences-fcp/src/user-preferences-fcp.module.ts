/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AccountModule } from '@fc/account';
import { CryptographyFcpModule } from '@fc/cryptography-fcp';
import { ExceptionsModule } from '@fc/exceptions';
import { LoggerModule } from '@fc/logger';
import { MongooseModule } from '@fc/mongoose';

import { UserPreferencesFcpController } from './controllers';
import { UserPreferencesFcpService } from './services';

@Module({
  imports: [
    ExceptionsModule,
    MongooseModule,
    LoggerModule,
    AccountModule,
    CryptographyFcpModule,
  ],
  controllers: [UserPreferencesFcpController],
  providers: [UserPreferencesFcpService],
})
export class UserPreferencesFcpModule {}
