import Redis from 'ioredis';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';

import { RedisConfig } from '../dto';

@Injectable()
export class RedisService {
  public client: Redis;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const config = this.config.get<RedisConfig>('Redis');

    this.client = new Redis(config);
  }
}
