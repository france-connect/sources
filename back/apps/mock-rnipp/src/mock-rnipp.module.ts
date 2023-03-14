/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { MockRnippController } from './controllers';
import { MockRnippService } from './services';

@Module({
  imports: [],
  controllers: [MockRnippController],
  providers: [MockRnippService],
})
export class MockRnippModule {}
