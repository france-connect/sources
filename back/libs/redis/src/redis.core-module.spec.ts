import { REDIS_MODULE_OPTIONS_TOKEN } from './redis.constants';
import { RedisFactoryModule } from './redis.core-module';

describe('RedisFactoryModule', () => {
  const config: any = {
    host: 'host',
    db: 0,
    port: 1234,
    password: 'PassPart0ut',
  };

  const useFactorytMock = {
    useFactory: config,
  };

  const EmptyUseFactorytMock: any = {
    useFactory: null,
  };

  describe('createOptionsProvider', () => {
    it('should return usefactory with provided option token', () => {
      // action
      const res = RedisFactoryModule.createOptionsProvider(useFactorytMock);

      // expect
      expect(res).toStrictEqual({
        provide: REDIS_MODULE_OPTIONS_TOKEN,
        useFactory: config,
        inject: [],
      });
    });

    it('should throw error if useFactory is empty', () => {
      // setup
      const exception = new Error(
        'Invalid configuration. Must provide useFactory',
      );

      // action
      const call = () => {
        RedisFactoryModule.createOptionsProvider(EmptyUseFactorytMock);
      };

      // expect
      expect(call).toThrow(exception);
    });
  });

  describe('createAsyncProviders', () => {
    it('should return a list with provided options', () => {
      // action
      const res = RedisFactoryModule.createAsyncProviders(useFactorytMock);

      // expect
      expect(res).toStrictEqual([
        {
          provide: REDIS_MODULE_OPTIONS_TOKEN,
          useFactory: config,
          inject: [],
        },
      ]);
    });

    it('should throw error if useFactory is empty', () => {
      // setup
      const exception = new Error(
        'Invalid configuration. Must provide useFactory',
      );

      // action
      const call = () => {
        // is called into an async context but is not async itself
        RedisFactoryModule.createAsyncProviders(EmptyUseFactorytMock);
      };

      // expect
      expect(call).toThrow(exception);
    });
  });

  describe('forRootAsync', () => {
    it('should return inline snapchot forRootAsync', () => {
      // action
      const res = RedisFactoryModule.forRootAsync(useFactorytMock);

      // expect
      expect(res).toMatchInlineSnapshot(`
        Object {
          "exports": Array [
            Object {
              "inject": Array [
                "IORedisModuleOptionsToken",
              ],
              "provide": "IORedisModuleConnectionToken",
              "useFactory": [Function],
            },
          ],
          "imports": undefined,
          "module": [Function],
          "providers": Array [
            Object {
              "inject": Array [],
              "provide": "IORedisModuleOptionsToken",
              "useFactory": Object {
                "db": 0,
                "host": "host",
                "password": "PassPart0ut",
                "port": 1234,
              },
            },
            Object {
              "inject": Array [
                "IORedisModuleOptionsToken",
              ],
              "provide": "IORedisModuleConnectionToken",
              "useFactory": [Function],
            },
          ],
        }
      `);
    });
  });
});
