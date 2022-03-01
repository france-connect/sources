/* istanbul ignore file */

// declarative file
import { Module } from '@nestjs/common';

import { RabbitmqModule } from '@fc/rabbitmq';

import { UserPreferencesService } from './services';

@Module({
  imports: [RabbitmqModule.registerFor('UserPreferences')],
  providers: [UserPreferencesService],
  exports: [UserPreferencesService],
})
export class UserPreferencesModule {}
