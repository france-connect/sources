import Redis from 'ioredis';

import { createRedisConnection } from './redis.utils';

jest.mock('ioredis', () => ({
  default: jest.fn(),
}));

describe('createRedisConnection', () => {
  const config: any = {
    host: 'host',
    db: 0,
    port: 1234,
    password: 'PassPart0ut',
  };

  it('should have been called Redis once', () => {
    // action
    createRedisConnection(config);

    // expect
    expect(Redis).toHaveBeenCalledTimes(1);
  });
});
