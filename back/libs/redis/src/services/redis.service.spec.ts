import Redis from 'ioredis';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { RedisService } from './redis.service';

jest.mock('ioredis', () => ({
  default: class RedisMock {},
}));

describe('RedisService', () => {
  let service: RedisService;

  const configMock = getConfigMock();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, RedisService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
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
  });
});
