import { Request } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { DeviceHeaderFlagsService } from './device-header-flags.service';

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  createHmac: jest.fn(),
}));

describe('DeviceHeaderFlagsService', () => {
  let service: DeviceHeaderFlagsService;

  const configMock = getConfigMock();
  const configValueMock = {
    headerFlags: [
      {
        name: 'bar',
        positiveValue: 'yes',
      },
    ],
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceHeaderFlagsService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)

      .compile();

    service = module.get<DeviceHeaderFlagsService>(DeviceHeaderFlagsService);

    configMock.get.mockReturnValue(configValueMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isSuspicious', () => {
    const getResult = Symbol('getResult');
    beforeEach(() => {
      service['get'] = jest.fn().mockReturnValue(getResult);
    });

    it('should call service.get() with "x-suspicious"', () => {
      // Given
      const req = {} as Request;

      // When
      const result = service.isSuspicious(req);

      // Then
      expect(result).toBe(getResult);
      expect(service['get']).toHaveBeenCalledExactlyOnceWith(
        req,
        'x-suspicious',
      );
    });

    it('should return the result of service.get()', () => {
      // Given
      const req = {} as Request;

      // When
      const result = service.isSuspicious(req);

      // Then
      expect(result).toBe(getResult);
    });
  });

  describe('get', () => {
    // Given
    const req = {
      headers: {},
    } as Request;

    it('should fetch headerFlags from config', () => {
      // Given
      const flagName = 'bar';

      // When
      service['get'](req, flagName);

      // Then
      expect(configMock.get).toHaveBeenCalledExactlyOnceWith('Device');
    });

    it('should return true if header value is equal to flag positiveValue', () => {
      // Given
      const flagName = 'bar';
      req.headers[flagName] = 'yes';

      // When
      const result = service['get'](req, flagName);

      // Then
      expect(result).toBe(true);
    });

    it('should return false if header value is not equal to flag positiveValue', () => {
      // Given
      const flagName = 'bar';
      req.headers[flagName] = '1';

      // When
      const result = service['get'](req, flagName);

      // Then
      expect(result).toBe(false);
    });
  });
});
