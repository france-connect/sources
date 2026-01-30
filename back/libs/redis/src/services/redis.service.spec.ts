import Redis from 'ioredis';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { FcApplicationExceptionFilter } from '@fc/exceptions';

import { getConfigMock } from '@mocks/config';

import { RedisErrorEventException } from '../exceptions';
import { RedisService } from './redis.service';

jest.mock('ioredis', () => ({
  default: class RedisMock {
    public on = jest.fn().mockReturnThis();
  },
}));

describe('RedisService', () => {
  let service: RedisService;

  const configMock = getConfigMock();
  const exceptionFilterMock = {
    catch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, RedisService, FcApplicationExceptionFilter],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(FcApplicationExceptionFilter)
      .useValue(exceptionFilterMock)
      .compile();

    service = module.get<RedisService>(RedisService);

    configMock.get.mockReturnValue({});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should create redis client', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service.client).toBeDefined();
      expect(service.client).toBeInstanceOf(Redis);
    });

    it('should register on error listener', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service.client.on).toHaveBeenCalledExactlyOnceWith(
        'error',
        expect.any(Function),
      );
    });
  });

  describe('onError', () => {
    it('should catch redis error event', () => {
      // Given
      const error = new Error('test');

      // When
      service['onError'](error);

      // Then
      expect(exceptionFilterMock.catch).toHaveBeenCalledExactlyOnceWith(
        new RedisErrorEventException(error.message),
      );
    });
  });
});
