import { Module } from '@nestjs/common';

import { ExceptionsModule, FcApplicationExceptionFilter } from '@fc/exceptions';

import { RedisService } from './services';

@Module({
  imports: [ExceptionsModule],
  providers: [RedisService, FcApplicationExceptionFilter],
  exports: [RedisService],
})
export class RedisModule {}
