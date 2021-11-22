/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { ScopesService } from './scopes.service';

@Module({
  providers: [ScopesService],
  exports: [ScopesService],
})
export class ScopesModule {}
