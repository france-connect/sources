/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { mongooseProvider } from './mongoose.provider';

@Module({
  imports: [mongooseProvider],
  exports: [mongooseProvider],
})
export class MongooseModule {}
