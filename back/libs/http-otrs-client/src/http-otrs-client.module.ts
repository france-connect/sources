import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { HttpOtrsClientService } from './services';

@Module({
  imports: [HttpModule],
  providers: [HttpOtrsClientService],
  exports: [HttpOtrsClientService],
})
export class HttpOtrsClientModule {}
