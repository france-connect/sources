import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { RnippResponseParserService, RnippService } from './services';

@Module({
  imports: [HttpModule],
  providers: [RnippService, RnippResponseParserService],
  exports: [HttpModule, RnippService, RnippResponseParserService],
})
export class RnippModule {}
