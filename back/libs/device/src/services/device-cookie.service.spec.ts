import { randomBytes } from 'crypto';

import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { safelyParseJson, validateDto } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import {
  DeviceCookieInvalidDataException,
  DeviceCookieInvalidJsonException,
} from '../exceptions';
import { DeviceCookieService } from './device-cookie.service';

jest.mock('@fc/common');

jest.mock('crypto', () => ({
  ...jest.requireActual('crypto'),
  randomBytes: jest.fn(),
}));

describe('DeviceCookieService', () => {
  let service: DeviceCookieService;

  const validateDtoMock = jest.mocked(validateDto);
  const safelyParseJsonMock = jest.mocked(safelyParseJson);

  const validCookieData = {
    s: 'deviceSalt',
    e: [
      {
        h: 'hash',
        d: 123,
      },
    ],
  };
  // Base64 encoded JSON stringified of `validCookieData`
  const base64ValidJson =
    'eyJzIjoiZGV2aWNlU2FsdCIsImUiOlt7ImgiOiJoYXNoIiwiZCI6MTIzfV19';

  const configMock = getConfigMock();
  const configValueMock = {
    cookieName: 'device',
    cookieDomain: 'cookieDomain',
    identityHmacDailyTtl: 42,
  };

  const loggerMock = getLoggerMock();

  const randomBytesMock = jest.mocked(randomBytes);
  const randomBytesStringResult = Symbol('randomBytesStringResult');
  const randomBytesBufferResult = { toString: () => randomBytesStringResult };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceCookieService, ConfigService, LoggerService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)

      .compile();

    service = module.get<DeviceCookieService>(DeviceCookieService);

    configMock.get.mockReturnValue(configValueMock);
    validateDtoMock.mockResolvedValue([]);
    safelyParseJsonMock.mockReturnValue(validCookieData);
    // @fixme: TS consider that `randomBytes` return type is `void` instead of `Buffer`
    randomBytesMock.mockReturnValue(randomBytesBufferResult as unknown as void);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    const getDefaultReturnValue = Symbol('getDefaultReturnValue');
    beforeEach(() => {
      service['getDefault'] = jest.fn().mockReturnValue(getDefaultReturnValue);
    });

    it('should return default cookie when no cookie is present', async () => {
      // Given
      const req = {
        signedCookies: {},
      } as unknown as Request;

      // When
      const result = await service.get(req);

      // Then
      expect(result).toBe(getDefaultReturnValue);
    });

    it('should return default cookie when cookie is not parsable', async () => {
      // Given
      const req = {
        signedCookies: {
          [configValueMock.cookieName]: base64ValidJson,
        },
      } as unknown as Request;
      service['parseCookie'] = jest.fn().mockImplementationOnce(() => {
        throw new DeviceCookieInvalidJsonException();
      });

      // When
      const result = await service.get(req);

      // Then
      expect(service['parseCookie']).toHaveBeenCalledExactlyOnceWith(
        base64ValidJson,
      );
      expect(result).toBe(getDefaultReturnValue);
    });

    it('should log error and debug when cookie is not parsable', async () => {
      // Given
      const req = {
        signedCookies: {
          [configValueMock.cookieName]: base64ValidJson,
        },
      } as unknown as Request;
      service['parseCookie'] = jest.fn().mockImplementationOnce(() => {
        throw new DeviceCookieInvalidJsonException();
      });

      // When
      await service.get(req);

      // Then
      expect(loggerMock.err).toHaveBeenCalledExactlyOnceWith(
        'Invalid Device cookie',
        {
          error: expect.any(DeviceCookieInvalidJsonException),
        },
      );
      expect(loggerMock.debug).toHaveBeenCalledWith('Invalid Device cookie', {
        input: base64ValidJson,
      });
    });
  });

  describe('set', () => {
    it('should set cookie with name from config and base64 encoded JSON stringified informations as value', () => {
      // Given
      const res = {
        cookie: jest.fn(),
      } as unknown as Response;

      // When
      service.set(res, validCookieData);

      // Then
      expect(res.cookie).toHaveBeenCalledWith(
        configValueMock.cookieName,
        base64ValidJson,
        {
          secure: true,
          signed: true,
          httpOnly: true,
          sameSite: 'strict',
          domain: configValueMock.cookieDomain,
          maxAge: configValueMock.identityHmacDailyTtl * 24 * 60 * 60 * 1000,
        },
      );
    });
  });

  describe('parseCookie', () => {
    it('should throw if decoded input is not parsable as JSON ', async () => {
      // Given
      const input = 'invalidCookie';
      safelyParseJsonMock.mockImplementationOnce(() => {
        throw new TypeError('JSON not parsable');
      });

      // Then / When
      await expect(service['parseCookie'](input)).rejects.toThrow(
        DeviceCookieInvalidJsonException,
      );
    });

    it('should throw if parsed data from cookie is not valid according to DTO', async () => {
      // Given
      const input = 'invalidCookie';
      safelyParseJsonMock.mockReturnValueOnce({ some: 'invalidData' });
      validateDtoMock.mockResolvedValueOnce([
        { some: 'error' } as unknown as ValidationError,
      ]);

      // Then / When
      await expect(service['parseCookie'](input)).rejects.toThrow(
        DeviceCookieInvalidDataException,
      );
    });

    it('should return parsed data', async () => {
      // When
      const result = await service['parseCookie'](base64ValidJson);

      // Then
      expect(result).toEqual(validCookieData);
    });
  });

  describe('getDefault', () => {
    it('should return default cookie data', () => {
      // Given
      const deviceSaltValue = Symbol('deviceSaltValue');
      service['generateSalt'] = jest.fn().mockReturnValue(deviceSaltValue);

      // When
      const result = service['getDefault']();

      // Then
      expect(result).toEqual({
        s: deviceSaltValue,
        e: [],
      });
    });
  });

  describe('generateSalt', () => {
    it('should call randomBytes with 32 as bytes length argument', () => {
      // When
      service['generateSalt']();

      // Then
      expect(randomBytesMock).toHaveBeenCalledExactlyOnceWith(32);
    });

    it('should return randomBytes result as base64 string', () => {
      // When
      const result = service['generateSalt']();

      // Then
      expect(result).toBe(randomBytesStringResult);
    });
  });
});
