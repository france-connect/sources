import * as Redis from 'ioredis';

import { createRedisConnection } from './redis.utils';

jest.mock('ioredis');

describe('createRedisConnection', () => {
  const config: any = {
    host: 'host',
    db: 0,
    port: 1234,
    password: 'PassPart0ut',
  };

  it('sould have been called Redis once', () => {
    // action
    createRedisConnection(config);

    // expect
    expect(Redis).toHaveBeenCalledTimes(1);
  });
});
