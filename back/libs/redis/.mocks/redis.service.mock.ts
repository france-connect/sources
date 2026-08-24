export function getRedisServiceMock() {
  return {
    client: {
      del: jest.fn(),
      duplicate: jest.fn(),
      exec: jest.fn(),
      expire: jest.fn(),
      get: jest.fn(),
      multi: jest.fn(),
      publish: jest.fn(),
      set: jest.fn(),
      ttl: jest.fn(),
      lrange: jest.fn(),
      hgetall: jest.fn(),
      hset: jest.fn(),
    },
  };
}

export function getRedisSubscriberMock() {
  return {
    disconnect: jest.fn(),
    on: jest.fn(),
    quit: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };
}

export function getRedisServiceMultiMock() {
  return {
    del: jest.fn(),
    exec: jest.fn(),
    expire: jest.fn(),
    get: jest.fn(),
    multi: jest.fn(),
    set: jest.fn(),
    ttl: jest.fn(),
    lrange: jest.fn(),
    hgetall: jest.fn(),
    hset: jest.fn(),
  };
}
