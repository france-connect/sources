import { LoggerService } from '@fc/logger';
import { OidcProviderService } from '@fc/oidc-provider';
import { RedisService } from '@fc/redis';

import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock } from '@mocks/redis';

import {
  OidcProviderParseRedisResponseException,
  OidcProviderStringifyPayloadForRedisException,
} from '../exceptions';
import {
  OIDC_PROVIDER_REDIS_PREFIX,
  OidcProviderRedisAdapter,
} from './oidc-provider-redis.adapter';

describe('OidcProviderRedisAdapter', () => {
  let adapter;

  const loggerMock = getLoggerMock() as unknown as LoggerService;
  const redisMock = getRedisServiceMock();

  const multiMock = {
    hmset: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    expire: jest.fn(),
    rpush: jest.fn(),
    exec: jest.fn(),
    del: jest.fn(),
    ttl: jest.fn(),
  };
  const testAdapterName = 'testAdapterName';
  const ServiceProviderAdapterMock = {
    getList: jest.fn(),
    shouldExcludeIdp: jest.fn(),
    getById: jest.fn(),
  };

  beforeEach(() => {
    adapter = new OidcProviderRedisAdapter(
      redisMock as unknown as RedisService,
      ServiceProviderAdapterMock,
      testAdapterName,
    );

    jest.resetAllMocks();
    redisMock.client.multi.mockReturnValue(multiMock);
    redisMock.client.ttl.mockResolvedValue(42);
    redisMock.client.lrange.mockResolvedValue(['a', 'b', 'c']);
    multiMock.exec.mockImplementation();
    multiMock.hmset = jest.fn().mockReturnThis();
    multiMock.get = jest.fn().mockReturnThis();
    multiMock.set = jest.fn().mockReturnThis();
    multiMock.expire = jest.fn().mockReturnThis();
    multiMock.rpush = jest.fn().mockReturnThis();
    multiMock.exec = jest.fn().mockReturnThis();
    multiMock.del = jest.fn().mockReturnThis();
    multiMock.ttl = jest.fn().mockReturnThis();
  });

  describe('getConstructorWithDI', () => {
    // Given
    const nameMock = 'foo';
    const oidcProviderService = {
      logger: loggerMock,
      redis: redisMock,
    } as unknown as OidcProviderService;
    const BoundClass = OidcProviderRedisAdapter.getConstructorWithDI(
      oidcProviderService,
      ServiceProviderAdapterMock,
    );

    it('should pass controls in oidc-provider', () => {
      /**
       * @see https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/initialize_adapter.js#L13
       */
      // Then
      expect(BoundClass.prototype).toBeDefined();
      expect(BoundClass.prototype.constructor).toBeDefined();
      expect(BoundClass.prototype.constructor.name).toBeDefined();
    });

    it('Should return an instantiable class', () => {
      // When
      const result = new BoundClass(nameMock);
      // Then
      expect(result).toBeInstanceOf(OidcProviderRedisAdapter);
    });

    it('Should return an object having injected services', () => {
      // When
      const result = new BoundClass(nameMock) as any;
      // Then
      expect(result.redis).toBe(redisMock);
    });

    it('Should return an object having original argument handled', () => {
      // When
      const result = new BoundClass(nameMock) as any;
      // Then
      expect(result.contextName).toBe(nameMock);
    });
  });

  describe('upsert', () => {
    // Given
    const idMock = 'foo';
    const defaultPayload = {};
    const expiresIn = 6000;

    it('should throw if expires is not a number', async () => {
      // Given
      const expires = 'not a number';
      // Then
      await expect(
        adapter.upsert(idMock, defaultPayload, expires),
      ).rejects.toThrow(TypeError);
    });
    it('should call expires if expiresIn is provided', async () => {
      // When
      await adapter.upsert(idMock, defaultPayload, expiresIn);
      // Then
      expect(multiMock.expire).toHaveBeenCalledTimes(1);
    });
    it('should not call expires if expiresIn is not provided', async () => {
      // When
      await adapter.upsert(idMock, defaultPayload);
      // Then
      expect(multiMock.expire).toHaveBeenCalledTimes(0);
    });
    it('should call set for userCode', async () => {
      // Given
      const payload = { userCode: 'userCode' };
      adapter['userCodeKeyFor'] = jest.fn();
      adapter['userCodeKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:userCode:userCode`,
      );
      // When
      await adapter.upsert(idMock, payload);
      // Then
      expect(multiMock.set).toHaveBeenCalledTimes(2);
      expect(multiMock.set).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:testAdapterName:foo`,
        '{"userCode":"userCode"}',
      );
      expect(adapter['userCodeKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['userCodeKeyFor']).toHaveBeenCalledWith('userCode');
    });
    it('should call set for uid', async () => {
      // Given
      const payload = { uid: 'uid' };
      adapter['uidKeyFor'] = jest.fn();
      adapter['uidKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:uid:uid`,
      );
      // When
      await adapter.upsert(idMock, payload);
      // Then
      expect(multiMock.set).toHaveBeenCalledTimes(2);
      expect(multiMock.set).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:testAdapterName:foo`,
        '{"uid":"uid"}',
      );
      expect(adapter['uidKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['uidKeyFor']).toHaveBeenCalledWith('uid');
    });
    it('should call set and expires for all properties', async () => {
      // Given
      const payload = {
        grantId: 'grantId',
        userCode: 'userCode',
        uid: 'uid',
      };
      const SET_CALL_COUNT = 3;
      const RPUSH_CALL_COUNT = 1;
      const EXPIRE_CALL_COUNT = 4;
      adapter['userCodeKeyFor'] = jest.fn();
      adapter['userCodeKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:userCode:userCode`,
      );
      adapter['uidKeyFor'] = jest.fn();
      adapter['uidKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:uid:uid`,
      );
      adapter['grantKeyFor'] = jest.fn();
      adapter['grantKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:grant:grantId`,
      );
      // When
      await adapter.upsert(idMock, payload, expiresIn);
      // Then
      expect(multiMock.set).toHaveBeenCalledTimes(SET_CALL_COUNT);
      expect(multiMock.rpush).toHaveBeenCalledTimes(RPUSH_CALL_COUNT);
      expect(multiMock.expire).toHaveBeenCalledTimes(EXPIRE_CALL_COUNT);
      expect(adapter['userCodeKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['userCodeKeyFor']).toHaveBeenCalledWith('userCode');
      expect(adapter['uidKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['uidKeyFor']).toHaveBeenCalledWith('uid');
      expect(adapter['grantKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['grantKeyFor']).toHaveBeenCalledWith('grantId');
    });
    it('should throw an error if exec fails ', async () => {
      // Given
      const error = new Error('exec failed');
      multiMock.exec.mockRejectedValueOnce(error);
      // Then
      await expect(adapter.upsert(idMock, defaultPayload)).rejects.toThrow(
        error,
      );
    });
  });

  describe('addSetAndExpireOnMulti', () => {
    it('should call set and expires if key is defined', () => {
      // Given
      const keyMock = 'foo';
      const idMock = 'bar';
      const expiresIn = 6000;

      // When
      adapter['addSetAndExpireOnMulti'](keyMock, idMock, expiresIn, multiMock);

      //then
      expect(multiMock.set).toHaveBeenCalledTimes(1);
      expect(multiMock.set).toHaveBeenCalledWith('foo', 'bar');
      expect(multiMock.expire).toHaveBeenCalledTimes(1);
      expect(multiMock.expire).toHaveBeenCalledWith(`foo`, 6000);
    });
  });

  describe('saveGrantId', () => {
    it('should call rpush and not expire for grantId', async () => {
      // Given
      const grantId = 'grantId';
      const keyMock = 'foo';
      const expiresIn = 0;
      adapter['grantKeyFor'] = jest.fn();
      adapter['grantKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:grant:grantId`,
      );
      // When
      await adapter['saveGrantId'](multiMock, grantId, keyMock, expiresIn);
      // Then
      expect(multiMock.rpush).toHaveBeenCalledTimes(1);
      expect(multiMock.rpush).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:grant:grantId`,
        'foo',
      );
      expect(multiMock.expire).toHaveBeenCalledTimes(0);
      expect(adapter['grantKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['grantKeyFor']).toHaveBeenCalledWith('grantId');
    });

    it('should call rpush and expire for grantId', async () => {
      // Given
      const grantId = 'grantId';
      const keyMock = 'foo';
      const expiresIn = 6000;
      adapter['grantKeyFor'] = jest.fn();
      adapter['grantKeyFor'].mockReturnValue(
        `${OIDC_PROVIDER_REDIS_PREFIX}:grant:grantId`,
      );
      // When
      await adapter['saveGrantId'](multiMock, grantId, keyMock, expiresIn);
      // Then
      expect(multiMock.rpush).toHaveBeenCalledTimes(1);
      expect(multiMock.rpush).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:grant:grantId`,
        'foo',
      );
      expect(multiMock.expire).toHaveBeenCalledTimes(1);
      expect(multiMock.expire).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:grant:grantId`,
        6000,
      );
      expect(adapter['grantKeyFor']).toHaveBeenCalledTimes(1);
      expect(adapter['grantKeyFor']).toHaveBeenCalledWith('grantId');
    });
  });

  describe('saveKey', () => {
    it('Should throw if JSON.stringiy fails', () => {
      // Given
      const payload = { foo: 'bar', circularRef: null };
      const keyMock = 'foo';
      payload.circularRef = payload;
      // Then
      expect(() => adapter['saveKey'](multiMock, keyMock, payload)).toThrow(
        OidcProviderStringifyPayloadForRedisException,
      );
    });

    it('should call hmset if name is in consumable var', () => {
      // Given
      const authorizationCodeAdapter = new OidcProviderRedisAdapter(
        redisMock as unknown as RedisService,
        ServiceProviderAdapterMock,
        'AuthorizationCode',
      );
      const keyMock = 'foo';
      const defaultPayload = {};
      // When
      authorizationCodeAdapter['saveKey'](multiMock, keyMock, defaultPayload);
      // Then
      expect(multiMock.set).toHaveBeenCalledTimes(0);
      expect(multiMock.hmset).toHaveBeenCalledTimes(1);
      expect(multiMock.hmset).toHaveBeenCalledWith('foo', {
        payload: '{}',
      });
    });
    it('should call set if name is not in consumable var', () => {
      // Given
      const key = 'foo';
      const defaultPayload = {};

      // When
      adapter['saveKey'](multiMock, key, defaultPayload);
      // Then
      expect(multiMock.hmset).toHaveBeenCalledTimes(0);
      expect(multiMock.set).toHaveBeenCalledTimes(1);
      expect(multiMock.set).toHaveBeenCalledWith('foo', '{}');
    });
  });

  describe('uidKeyFor', () => {
    it('Should return null if no id is provide', () => {
      // Given
      const uidMock = '';

      // When
      const result = adapter['uidKeyFor'](uidMock);

      // Then
      expect(result).toEqual(null);
    });
    it('Should return a valid key if id is provide', () => {
      // Given
      const uidMock = 'foo';

      // When
      const result = adapter['uidKeyFor'](uidMock);

      // Then
      expect(result).toEqual(`${OIDC_PROVIDER_REDIS_PREFIX}:uid:foo`);
    });
  });

  describe('userCodeKeyFor', () => {
    it('Should return null if no id is provide', () => {
      // Given
      const codeMock = '';

      // When
      const result = adapter['userCodeKeyFor'](codeMock);

      // Then
      expect(result).toEqual(null);
    });
    it('Should return a valid key if id is provide', () => {
      // Given
      const codeMock = 'foo';

      // When
      const result = adapter['userCodeKeyFor'](codeMock);

      // Then
      expect(result).toEqual(`${OIDC_PROVIDER_REDIS_PREFIX}:userCode:foo`);
    });
  });

  describe('grantKeyFor', () => {
    it('Should return null if no id is provide', () => {
      // Given
      const idMock = '';

      // When
      const result = adapter['grantKeyFor'](idMock);

      // Then
      expect(result).toEqual(null);
    });
    it('Should return a valid key if id is provide', () => {
      // Given
      const idMock = 'foo';

      // When
      const result = adapter['grantKeyFor'](idMock);

      // Then
      expect(result).toEqual(`${OIDC_PROVIDER_REDIS_PREFIX}:grant:foo`);
    });
  });

  describe('findServiceProvider', () => {
    it('should call serviceProvider getById', async () => {
      // GIVEN
      const id = 'greatId';

      // WHEN
      await adapter['findServiceProvider'](id);

      // THEN
      expect(ServiceProviderAdapterMock.getById).toHaveBeenCalledTimes(1);
      expect(ServiceProviderAdapterMock.getById).toHaveBeenCalledWith(id);
    });

    it('should return the found service provider', async () => {
      // GIVEN
      const id = 'greatId';
      const sp = { name: 'greatFS' };
      ServiceProviderAdapterMock.getById.mockResolvedValueOnce(sp);

      // WHEN
      const result = await adapter['findServiceProvider'](id);

      // THEN
      expect(result).toEqual(sp);
    });
  });

  describe('findInRedis', () => {
    it('should call hgetall rather than get if name is in consumable var', async () => {
      // Given
      const authorizationCodeAdapter = new OidcProviderRedisAdapter(
        redisMock as unknown as RedisService,
        ServiceProviderAdapterMock,
        'AuthorizationCode',
      );
      const idMock = 'foo';
      // When
      await authorizationCodeAdapter['findInRedis'](idMock);
      // Then
      expect(redisMock.client.hgetall).toHaveBeenCalledTimes(1);
      expect(redisMock.client.hgetall).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:AuthorizationCode:foo`,
      );
      expect(redisMock.client.get).toHaveBeenCalledTimes(0);
    });

    it('should call get rather than hgetall if name is not in consumable var', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter['findInRedis'](idMock);
      // Then
      expect(redisMock.client.get).toHaveBeenCalledTimes(1);
      expect(redisMock.client.get).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:testAdapterName:foo`,
      );
      expect(redisMock.client.hgetall).toHaveBeenCalledTimes(0);
    });

    it('should return undefined if response is empty', async () => {
      // Given
      const idMock = 'foo';
      redisMock.client.get.mockResolvedValue(null);
      // When
      const result = await adapter['findInRedis'](idMock);
      // Then
      expect(result).toBe(undefined);
    });

    it('should return an object parsed from JSON if response is a string', async () => {
      // Given
      const idMock = 'foo';
      redisMock.client.get.mockResolvedValue('{"foo":"bar"}');
      adapter['parsedPayload'] = jest.fn();
      adapter['parsedPayload'].mockReturnValue({ foo: 'bar' });
      // When
      const result = await adapter['findInRedis'](idMock);
      // Then
      expect(result).toEqual({ foo: 'bar' });
      expect(adapter['parsedPayload']).toHaveBeenCalledTimes(1);
      expect(adapter['parsedPayload']).toHaveBeenCalledWith('{"foo":"bar"}');
    });

    it('should return a merged object if response is an object', async () => {
      // Given
      const idMock = 'foo';
      redisMock.client.get.mockResolvedValue({
        payload: '{"fizz":"buzz"}',
        foo: 'bar',
      });
      adapter['parsedPayload'] = jest.fn();
      adapter['parsedPayload'].mockReturnValue({ fizz: 'buzz' });
      // When
      const result = await adapter['findInRedis'](idMock);
      // Then
      expect(result).toEqual({ fizz: 'buzz', foo: 'bar' });
      expect(adapter['parsedPayload']).toHaveBeenCalledTimes(1);
      expect(adapter['parsedPayload']).toHaveBeenCalledWith('{"fizz":"buzz"}');
    });
  });

  describe('find', () => {
    const id = 'greatId';

    it('should return found Service Provider if the contextName is client', async () => {
      // GIVEN
      adapter['contextName'] = 'Client';
      adapter['findServiceProvider'] = jest.fn();

      // WHEN
      await adapter.find(id);

      // THEN
      expect(adapter['findServiceProvider']).toHaveBeenCalledTimes(1);
      expect(adapter['findServiceProvider']).toHaveBeenCalledWith(id);
    });

    it('should return findInRedis if the contextName is not client', async () => {
      // GIVEN
      adapter['findInRedis'] = jest.fn();

      // WHEN
      await adapter.find(id);

      // THEN
      expect(adapter['findInRedis']).toHaveBeenCalledTimes(1);
      expect(adapter['findInRedis']).toHaveBeenCalledWith(id);
    });
  });

  describe('parsedPayload', () => {
    it('should return a merged object if response is an object', () => {
      // Given
      const payloadMock = '{"fizz":"buzz"}';
      // When
      const result = adapter['parsedPayload'](payloadMock);
      // Then
      expect(result).toEqual({ fizz: 'buzz' });
    });
    it('should throw if raw response can not be JSON parsed', () => {
      // Given
      const payloadMock = 'not so much json';
      // Then
      expect(() => adapter['parsedPayload'](payloadMock)).toThrow(
        OidcProviderParseRedisResponseException,
      );
    });
  });

  describe('findByUid', () => {
    it('should call find with the result of redis.get', async () => {
      // Given
      const idMock = 'foo';
      adapter.find = jest.fn();
      const redisGetResolvedValue = Symbol('redisGetResolvedValue');
      redisMock.client.get.mockResolvedValueOnce(redisGetResolvedValue);
      // When
      await adapter.findByUid(idMock);
      // Then
      expect(redisMock.client.get).toHaveBeenCalledTimes(1);
      expect(redisMock.client.get).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:uid:foo`,
      );
      expect(adapter.find).toHaveBeenCalledTimes(1);
      expect(adapter.find).toHaveBeenCalledWith(redisGetResolvedValue);
    });
  });

  describe('findByUserCode', () => {
    it('should call find with the result of redis.get', async () => {
      // Given
      const idMock = 'foo';
      adapter.find = jest.fn();
      const redisGetResolvedValue = Symbol('redisGetResolvedValue');
      redisMock.client.get.mockResolvedValueOnce(redisGetResolvedValue);
      // When
      await adapter.findByUserCode(idMock);
      // Then
      expect(redisMock.client.get).toHaveBeenCalledTimes(1);
      expect(redisMock.client.get).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:userCode:foo`,
      );
      expect(adapter.find).toHaveBeenCalledTimes(1);
      expect(adapter.find).toHaveBeenCalledWith(redisGetResolvedValue);
    });
  });

  describe('destroy', () => {
    it('should call del', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.destroy(idMock);
      // Then
      expect(redisMock.client.del).toHaveBeenCalledTimes(1);
      expect(redisMock.client.del).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:testAdapterName:foo`,
      );
    });
  });

  describe('revokeByGrantId', () => {
    it('should call redis multi', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.revokeByGrantId(idMock);
      // Then
      expect(redisMock.client.multi).toHaveBeenCalledTimes(1);
    });
    it('should call redis lrange', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.revokeByGrantId(idMock);
      // Then
      expect(redisMock.client.lrange).toHaveBeenCalledTimes(1);
    });
    it('should call muti.del for each token found by lrange and one time for grant', async () => {
      // Given
      const idMock = 'foo';
      const CALL_COUNT = 4; // 3 items returned + the grant
      // When
      await adapter.revokeByGrantId(idMock);
      // Then
      expect(multiMock.del).toHaveBeenCalledTimes(CALL_COUNT);
    });
    it('should throw an error if exec fails ', async () => {
      // Given
      const idMock = 'foo';
      const errorMock = new Error('exec failed');
      multiMock.exec.mockRejectedValueOnce(errorMock);
      // Then
      await expect(adapter.revokeByGrantId(idMock)).rejects.toThrow(errorMock);
    });
  });

  describe('consume', () => {
    it('should cann redis.hset', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.consume(idMock);
      // Then
      expect(redisMock.client.hset).toHaveBeenCalledTimes(1);
      expect(redisMock.client.hset).toHaveBeenCalledWith(
        `${OIDC_PROVIDER_REDIS_PREFIX}:testAdapterName:foo`,
        'consumed',
        expect.any(Number),
      );
    });
  });

  describe('fetchTtlAndValue', () => {
    const ttlMock = 42;
    const valueMock = 'someValue';

    const successMock = [
      [undefined, ttlMock],
      [undefined, valueMock],
    ];

    beforeEach(() => {
      multiMock.exec.mockResolvedValue(successMock);
    });
    it('should call redis.multi', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.fetchTtlAndValue(idMock);
      // Then
      expect(redisMock.client.multi).toHaveBeenCalledTimes(1);
    });

    it('should call redis.ttl', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.fetchTtlAndValue(idMock);
      // Then
      expect(multiMock.ttl).toHaveBeenCalledTimes(1);
    });

    it('should call redis.get', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.fetchTtlAndValue(idMock);
      // Then
      expect(multiMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call redis.multi.exec', async () => {
      // Given
      const idMock = 'foo';
      // When
      await adapter.fetchTtlAndValue(idMock);
      // Then
      expect(multiMock.exec).toHaveBeenCalledTimes(1);
    });

    it('should return an object with ttl and value', async () => {
      // Given
      const idMock = 'foo';
      // When
      const result = await adapter.fetchTtlAndValue(idMock);
      // Then
      expect(result).toEqual({ ttl: ttlMock, value: valueMock });
    });

    it('should return ttl = -1 and value = null', async () => {
      // Given
      const idMock = 'foo';
      multiMock.exec.mockResolvedValueOnce([
        [undefined, undefined],
        [undefined, null],
      ]);
      // When
      const result = await adapter.fetchTtlAndValue(idMock);
      // Then
      expect(result).toEqual({ ttl: -1, value: null });
    });
  });

  describe('getExpireAndPayload', () => {
    // Given
    const idMock = 'foo';
    const ttlMock = 42;
    const valueMock = '{"some": "json", "payload": "here"}';
    const payloadMock = { some: 'json', payload: 'here' };
    const nowMock = 100000;
    const keyMock = 'keyMockValue';

    beforeEach(() => {
      adapter.fetchTtlAndValue = jest.fn().mockResolvedValue({
        ttl: ttlMock,
        value: valueMock,
      });
      adapter.key = jest.fn().mockReturnValue(keyMock);
      adapter.parsedPayload = jest.fn().mockReturnValue(payloadMock);
      jest.spyOn(Date, 'now').mockReturnValue(nowMock);
    });

    it('should call key', async () => {
      // When
      await adapter.getExpireAndPayload(idMock);
      // Then
      expect(adapter.key).toHaveBeenCalledTimes(1);
      expect(adapter.key).toHaveBeenCalledWith(idMock);
    });

    it('should call fetchTtlAndValue', async () => {
      // When
      await adapter.getExpireAndPayload(idMock);
      // Then
      expect(adapter.fetchTtlAndValue).toHaveBeenCalledTimes(1);
      expect(adapter.fetchTtlAndValue).toHaveBeenCalledWith(keyMock);
    });

    it('should call parsedPayload', async () => {
      // When
      await adapter.getExpireAndPayload(idMock);
      // Then
      expect(adapter.parsedPayload).toHaveBeenCalledTimes(1);
      expect(adapter.parsedPayload).toHaveBeenCalledWith(valueMock);
    });

    it('should return an object with expire and payload', async () => {
      // When
      const result = await adapter.getExpireAndPayload(idMock);
      // Then
      expect(result).toEqual({ expire: 142, payload: payloadMock });
    });

    it('should return expire = -1 and payload = null', async () => {
      // Given
      adapter.fetchTtlAndValue.mockResolvedValueOnce({
        ttl: -1,
        value: null,
      });
      // When
      const result = await adapter.getExpireAndPayload(idMock);
      // Then
      expect(result).toEqual({ expire: -1, payload: null });
    });
  });
});
