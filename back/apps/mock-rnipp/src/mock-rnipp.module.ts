/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { AsyncLocalStorageModule } from '@fc/async-local-storage';

import { MockRnippController } from './controllers';
import { MockRnippService } from './services';

@Module({
  imports: [AsyncLocalStorageModule],
  controllers: [MockRnippController],
  providers: [MockRnippService],
})
export class MockRnippModule {}
