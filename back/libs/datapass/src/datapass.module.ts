import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { DatapassApiService } from './services';

@Module({
  imports: [HttpModule],
  providers: [DatapassApiService],
  exports: [DatapassApiService],
})
export class DatapassModule {}
