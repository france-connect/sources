/* istanbul ignore file */
// Declarative code
import { Module } from '@nestjs/common';

import { FeatureHandlerNoHandler } from './handlers';

@Module({
  imports: [],
  providers: [FeatureHandlerNoHandler],
  exports: [FeatureHandlerNoHandler],
})
export class FeatureHandlerModule {}
