import Redis from 'ioredis';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { FcApplicationExceptionFilter } from '@fc/exceptions';

import { RedisConfig } from '../dto';
import { RedisErrorEventException } from '../exceptions';

@Injectable()
export class RedisService {
  public client: Redis;

  constructor(
    private readonly config: ConfigService,
    private readonly exceptionFilter: FcApplicationExceptionFilter,
  ) {}

  onModuleInit() {
    const config = this.config.get<RedisConfig>('Redis');

    this.client = new Redis(config);

    this.client.on('error', this.onError.bind(this));
  }

  private onError(error: Error) {
    this.exceptionFilter.catch(new RedisErrorEventException(error.message));
  }
}
