/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { mongooseModuleBuilder } from './mongoose.module.builder';

const mongooseModuleGenerated = mongooseModuleBuilder();

@Module({
  imports: [mongooseModuleGenerated],
  exports: [mongooseModuleGenerated],
})
export class MongooseModule {}
