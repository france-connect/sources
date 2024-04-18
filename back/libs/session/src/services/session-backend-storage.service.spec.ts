import { ValidationError } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { CryptographyService } from '@fc/cryptography';
import { LoggerService } from '@fc/logger';
import { RedisService } from '@fc/redis';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock, getRedisServiceMultiMock } from '@mocks/redis';

import {
  SessionBadAliasException,
  SessionBadFormatException,
  SessionBadStringifyException,
  SessionNotFoundException,
  SessionStorageException,
} from '../exceptions';
import { SessionBackendStorageService } from './session-backend-storage.service';

jest.mock('@fc/common');

describe('SessionBackendStorageService', () => {
  let service: SessionBackendStorageService;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();

  const validatedDtoMock = jest.mocked(validateDto);

  const encryptionKeyMock = 'encryptionKeyMock';
  const configDataMock = {
    schema: {},
    lifetime: 42,
    encryptionKey: encryptionKeyMock,
    prefix: 'prefixMock',
  };

  const redisMock = getRedisServiceMock();
  const redisMultiMock = getRedisServiceMultiMock();

  const redisDataMock = {
    data: Symbol(),
  };

  const cryptographyMock = {
    encryptSymetric: jest.fn(),
    decryptSymetric: jest.fn(),
  };

  const sessionId = 'sessionId';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionBackendStorageService,
        ConfigService,
        CryptographyService,
        RedisService,
        LoggerService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyService)
      .useValue(cryptographyMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<SessionBackendStorageService>(
      SessionBackendStorageService,
    );

    configMock.get.mockReturnValue(configDataMock);

    redisMock.client.get.mockResolvedValue(redisDataMock);
    redisMock.client.multi.mockReturnValue(redisMultiMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get()', () => {
    const sessionKey = 'sessionKey';
    const deserializedData = {};

    beforeEach(() => {
      service['getSessionKey'] = jest.fn().mockReturnValue(sessionKey);
      service['deserialize'] = jest.fn().mockReturnValue(deserializedData);
      service['validate'] = jest.fn();
    });

    it('should call getSessionKey()', async () => {
      // When
      await service.get(sessionId);

      // Then
      expect(service['getSessionKey']).toHaveBeenCalledWith(sessionId);
    });

    it('should call redis.client.get()', async () => {
      // When
      await service.get(sessionId);

      // Then
      expect(redisMock.client.get).toHaveBeenCalledWith(sessionKey);
    });

    it('should throw if dataCipher is empty', async () => {
      // Given
      const dataCipherMock = undefined;
      redisMock.client.get.mockResolvedValue(dataCipherMock);

      // When / Then
      await expect(service.get(sessionId)).rejects.toThrow(
        SessionNotFoundException,
      );
    });

    it('should throw SessionStorageException if redis.client throws', async () => {
      // Given
      const error = new Error('error');
      redisMock.client.get.mockRejectedValueOnce(error);

      // When / Then
      await expect(service.get(sessionId)).rejects.toThrow(
        SessionStorageException,
      );
    });

    it('should call deserialize()', async () => {
      // When
      await service.get(sessionId);

      // Then
      expect(service['deserialize']).toHaveBeenCalledWith(redisDataMock);
    });

    it('should call validate()', async () => {
      // When
      await service.get(sessionId);

      // Then
      expect(service['validate']).toHaveBeenCalledWith(deserializedData);
    });

    it('should return deserializedData', async () => {
      // When
      const result = await service.get(sessionId);

      // Then
      expect(result).toBe(deserializedData);
    });
  });

  describe('remove()', () => {
    const key = 'key';

    beforeEach(() => {
      service['getSessionKey'] = jest.fn().mockReturnValue(key);
    });

    it('should call getSessionKey()', async () => {
      // When
      await service.remove(sessionId);

      // Then
      expect(service['getSessionKey']).toHaveBeenCalledWith(sessionId);
    });

    it('should call redis.client.del()', async () => {
      // When
      await service.remove(sessionId);

      // Then
      expect(redisMock.client.del).toHaveBeenCalledWith(key);
    });

    it('should return the result of redis.client.del()', async () => {
      // Given
      const result = 1;
      redisMock.client.del.mockResolvedValue(result);

      // When
      const response = await service.remove(sessionId);

      // Then
      expect(response).toBe(result);
    });
  });

  describe('expire()', () => {
    const key = 'key';
    const ttl = 100;

    beforeEach(() => {
      service['getSessionKey'] = jest.fn().mockReturnValue(key);
    });

    it('should call getSessionKey()', async () => {
      // When
      await service.expire(sessionId, ttl);

      // Then
      expect(service['getSessionKey']).toHaveBeenCalledWith(sessionId);
    });

    it('should call redis.client.expire()', async () => {
      // When
      await service.expire(sessionId, ttl);

      // Then
      expect(redisMock.client.expire).toHaveBeenCalledWith(key, ttl);
    });

    it('should return the result of redis.client.expire()', async () => {
      // Given
      const result = 1;
      redisMock.client.expire.mockResolvedValue(result);

      // When
      const response = await service.expire(sessionId, ttl);

      // Then
      expect(response).toBe(result);
    });
  });

  describe('save()', () => {
    const key = 'key';
    const data = { foo: 'bar' };
    const serialized = 'serialized';
    const multiExecResult = [0, 1];

    beforeEach(() => {
      service['getSessionKey'] = jest.fn().mockReturnValue(key);
      service['serialize'] = jest.fn().mockReturnValue(serialized);

      redisMultiMock.exec.mockResolvedValue(multiExecResult);
    });

    it('should call getSessionKey()', async () => {
      // When
      await service.save(sessionId, data);

      // Then
      expect(service['getSessionKey']).toHaveBeenCalledWith(sessionId);
    });

    it('should call serialize()', async () => {
      // When
      await service.save(sessionId, data);

      // Then
      expect(service['serialize']).toHaveBeenCalledWith(data);
    });

    it('should call redis.client.multi()', async () => {
      // When
      await service.save(sessionId, data);

      // Then
      expect(redisMock.client.multi).toHaveBeenCalled();
    });

    it('should call redis.client.multi.set()', async () => {
      // When
      await service.save(sessionId, data);

      // Then
      expect(redisMultiMock.set).toHaveBeenCalledWith(key, serialized);
    });

    it('should call redis.client.expire()', async () => {
      // When
      await service.save(sessionId, data);

      // Then
      expect(redisMultiMock.expire).toHaveBeenCalledWith(
        key,
        configDataMock.lifetime,
      );
    });

    it('should return the result of multi.exec()', async () => {
      // When
      const response = await service.save(sessionId, data);

      // Then
      expect(response).toBe(true);
    });
  });

  describe('serialize()', () => {
    const data = { foo: 'bar' };

    const jsonStringifyResult = 'jsonStringifyResult';

    beforeEach(() => {
      jest.spyOn(JSON, 'stringify').mockReturnValue(jsonStringifyResult);
    });

    it('should call config.get()', () => {
      // When
      service['serialize'](data);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call JSON.stringify()', () => {
      // When
      service['serialize'](data);

      // Then
      expect(JSON.stringify).toHaveBeenCalledWith(data);
    });

    it('should throw SessionBadStringifyException if JSON.stringify() throws', () => {
      // Given
      const error = new Error('error');
      jest.mocked(JSON.stringify).mockImplementationOnce(() => {
        throw error;
      });

      // When / Then
      expect(() => service['serialize'](data)).toThrow(
        SessionBadStringifyException,
      );
    });

    it('should call cryptographyService.encryptSymetric()', () => {
      // When
      service['serialize'](data);

      // Then
      expect(cryptographyMock.encryptSymetric).toHaveBeenCalledWith(
        encryptionKeyMock,
        jsonStringifyResult,
      );
    });

    it('should return the result of cryptographyService.encryptSymetric()', () => {
      // Given
      const encryptSymetricResult = 'result';
      cryptographyMock.encryptSymetric.mockReturnValue(encryptSymetricResult);

      // When
      const result = service['serialize'](data);

      // Then
      expect(result).toBe(result);
    });
  });

  describe('deserialize()', () => {
    const dataCipher = 'dataCipher';
    const data = { foo: 'bar' };

    beforeEach(() => {
      cryptographyMock.decryptSymetric.mockReturnValue(JSON.stringify(data));
      jest.spyOn(JSON, 'parse').mockReturnValue(data);
    });

    it('should call cryptographyService.decryptSymetric()', () => {
      // When
      service['deserialize'](dataCipher);

      // Then
      expect(cryptographyMock.decryptSymetric).toHaveBeenCalledWith(
        encryptionKeyMock,
        dataCipher,
      );
    });

    it('should call JSON.parse()', () => {
      // When
      service['deserialize'](dataCipher);

      // Then
      expect(JSON.parse).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it('should throw SessionBadFormatException if JSON.parse() throws', () => {
      // Given
      const error = new Error('error');
      jest.mocked(JSON.parse).mockImplementationOnce(() => {
        throw error;
      });

      // When / Then
      expect(() => service['deserialize'](dataCipher)).toThrow(
        SessionBadFormatException,
      );
    });

    it('should return the result of JSON.parse()', () => {
      // When
      const result = service['deserialize'](dataCipher);

      // Then
      expect(result).toStrictEqual(data);
    });
  });

  describe('validate()', () => {
    const data = { foo: 'bar' };

    beforeEach(() => {
      validatedDtoMock.mockResolvedValue([]);
    });

    it('should call config.get()', async () => {
      // When
      await service['validate'](data);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call validateDto()', async () => {
      // When
      await service['validate'](data);

      // Then
      expect(validatedDtoMock).toHaveBeenCalledWith(
        data,
        configDataMock.schema,
        validationOptions,
      );
    });

    /**
     *
     * Temporary disable throw to gather informations via logging
     *
     * @todo #1575 Activate test when throw is enabled
     *
     * it('should throw SessionInvalidSessionException if validateDto() returns errors', async () => {
     *   // Given
     *   const errors = [{ foo: 'bar' }] as unknown as ValidationError[];
     *   validatedDtoMock.mockResolvedValueOnce(errors);
     *
     *   // When / Then
     *   await expect(service['validate'](data)).rejects.toThrow(
     *     SessionInvalidSessionDataException,
     *     );
     *   });
     */
    it('should log errors if validateDto() returns errors', async () => {
      // Given
      const errors = [{ foo: 'bar' }] as unknown as ValidationError[];
      validatedDtoMock.mockResolvedValueOnce(errors);

      // When
      await service['validate'](data);

      // Then
      expect(loggerMock.crit).toHaveBeenCalledWith(
        'SessionService:validate() Invalid session data from Redis',
      );
    });
  });

  describe('getSessionKey()', () => {
    it('should call config.get()', () => {
      // When
      service['getSessionKey'](sessionId);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should return the session key', () => {
      // When
      const result = service['getSessionKey'](sessionId);

      // Then
      expect(result).toBe(`${configDataMock.prefix}::${sessionId}`);
    });
  });

  describe('setAlias', () => {
    const alias = 'alias';

    it('should call config.get()', async () => {
      // When
      await service.setAlias(alias, sessionId);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call redis.client.multi()', async () => {
      // When
      await service.setAlias(alias, sessionId);

      // Then
      expect(redisMock.client.multi).toHaveBeenCalled();
    });

    it('should call redis.client.multi.set()', async () => {
      // When
      await service.setAlias(alias, sessionId);

      // Then
      expect(redisMultiMock.set).toHaveBeenCalledWith(alias, sessionId);
    });

    it('should call redis.client.multi.expire()', async () => {
      // When
      await service.setAlias(alias, sessionId);

      // Then
      expect(redisMultiMock.expire).toHaveBeenCalledWith(
        alias,
        configDataMock.lifetime,
      );
    });

    it('should call multi.exec()', async () => {
      // Given
      const result = [0, 1];
      redisMultiMock.exec.mockResolvedValue(result);

      // When
      await service.setAlias(alias, sessionId);

      // Then
      expect(redisMultiMock.exec).toHaveBeenCalledTimes(1);
    });

    it('should return the result of multi.exec()', async () => {
      // Given
      const result = [0, 1];
      redisMultiMock.exec.mockResolvedValue(result);

      // When
      const response = await service.setAlias(alias, sessionId);

      // Then
      expect(response).toBe(result);
    });
  });

  describe('getAlias', () => {
    const alias = 'alias';

    it('should throw SessionBadAliasException if alias is empty', async () => {
      // When / Then
      await expect(service.getAlias('')).rejects.toThrow(
        SessionBadAliasException,
      );
    });

    it('should call redis.client.get()', async () => {
      // When
      await service.getAlias(alias);

      // Then
      expect(redisMock.client.get).toHaveBeenCalledTimes(1);
      expect(redisMock.client.get).toHaveBeenCalledWith(alias);
    });

    it('should return the result of client.get()', async () => {
      // Given
      const redisResult = Symbol('redisResult');
      redisMock.client.get.mockResolvedValue(redisResult);

      // When
      const result = await service.getAlias(alias);

      // Then
      expect(result).toBe(redisResult);
    });
  });
});
