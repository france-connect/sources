/* istanbul ignore file */

import { ConfigModule, ConfigService } from '@fc/config';

import { RedisConfig } from './dto';
import { RedisFactoryModule } from './redis.core-module';

const redisProvider = RedisFactoryModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    const config = configService.get<RedisConfig>('Redis');
    return {
      config: {
        ...config,
        maxRetriesPerRequest: 1,
        // Only reconnect when the error contains "READONLY"
        reconnectOnError: ({ message }) => message.includes('READONLY'),
      },
    };
  },
});

export { redisProvider };
