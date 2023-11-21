/* istanbul ignore file */

// Declarative code
import { Module } from '@nestjs/common';

import { JwtService } from './services';

@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
