/* istanbul ignore file */

// Declarative code
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { JwtService } from './services';

@Module({
  imports: [HttpModule],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
