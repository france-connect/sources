import { Module } from '@nestjs/common';

import { RedisService } from './services';

@Module({
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
