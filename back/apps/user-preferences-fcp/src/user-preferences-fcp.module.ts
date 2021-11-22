/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ExceptionsModule } from '@fc/exceptions';

import { UserPreferencesFcpController } from './controllers';
import { UserPreferencesFcpService } from './services';

@Module({
  imports: [ExceptionsModule],
  controllers: [UserPreferencesFcpController],
  providers: [UserPreferencesFcpService],
})
export class UserPreferencesFcpModule {}
