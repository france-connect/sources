import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getConfigMock } from '@mocks/config';

import { SessionBadCookieException } from '../exceptions';
import { SessionCookiesService } from './session-cookies.service';

jest.mock('@fc/common');

describe('SessionCookiesService', () => {
  let service: SessionCookiesService;

  const configMock = getConfigMock();
  const configDataMock = {
    cookieOptions: { foo: 'bar' },
    sessionCookieName: Symbol('sessionCookieName'),
  };

  const sessionId = 'sessionId';

  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  const req = {
    signedCookies: {
      [configDataMock.sessionCookieName]: sessionId,
    },
  } as unknown as Request;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionCookiesService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)

      .compile();

    service = module.get<SessionCookiesService>(SessionCookiesService);

    configMock.get.mockReturnValue(configDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should call config.get()', () => {
      // When
      service.get(req);

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should return the session id', () => {
      // Given

      // When
      const result = service.get(req);

      // Then
      expect(result).toBe(sessionId);
    });

    it('should throw an error if the session id is not a string', () => {
      // Given
      req.signedCookies[configDataMock.sessionCookieName] = 1;

      // When
      const result = () => service.get(req);

      // Then
      expect(result).toThrow(SessionBadCookieException);
    });
  });

  describe('set', () => {
    it('should call config.get()', () => {
      // When
      service.set(res, 'sessionId');

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call res.cookie()', () => {
      // When
      service.set(res, 'sessionId');

      // Then
      expect(res.cookie).toHaveBeenCalledWith(
        configDataMock.sessionCookieName,
        'sessionId',
        configDataMock.cookieOptions,
      );
    });
  });

  describe('remove', () => {
    it('should call config.get()', () => {
      // When
      service.remove(res);

      // Then
      expect(configMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call res.clearCookie()', () => {
      // When
      service.remove(res);

      // Then
      expect(res.clearCookie).toHaveBeenCalledWith(
        configDataMock.sessionCookieName,
        {
          ...configDataMock.cookieOptions,
          maxAge: -1,
          signed: false,
        },
      );
    });
  });
});
