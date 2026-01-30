import { Module } from '@nestjs/common';

import { HttpOtrsClientService } from './http-otrs-client.service';

@Module({
  providers: [HttpOtrsClientService],
  exports: [HttpOtrsClientService],
})
export class HttpOtrsClientModule {}
