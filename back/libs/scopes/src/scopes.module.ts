/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ScopesIndexService, ScopesService } from './services';

@Module({
  providers: [ScopesService, ScopesIndexService],
  exports: [ScopesService],
})
export class ScopesModule {}
