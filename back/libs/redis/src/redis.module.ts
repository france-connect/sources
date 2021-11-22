import { Module } from '@nestjs/common';

import { redisProvider } from './redis.provider';

@Module({
  imports: [redisProvider],
  exports: [redisProvider],
})
export class RedisModule {}
