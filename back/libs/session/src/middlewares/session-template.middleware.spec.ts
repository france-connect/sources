import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { SessionConfig } from '../dto';
import { SessionService } from '../services';
import { SessionTemplateMiddleware } from './session-template.middleware';

describe('sessionTemplateMiddleware', () => {
  let middleware: SessionTemplateMiddleware;

  jest.mock('../decorators', () => ({
    extractSessionFromRequest: jest.fn(),
  }));

  const loggerServiceMock = {
    setContext: jest.fn(),
    trace: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
    shouldHandleSession: jest.fn(),
  };

  const oidcClientMock = { foo: true, bar: true };

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
    templateExposed: { oidcClient: oidcClientMock },
  };

  const sessionMock = {
    spId: 'mockSpId',
    spName: 'mockSpName',
  };

  const reqMock = {
    url: '/some/route',
    signedCookies: {
      [configMock.sessionCookieName]: 'sessionIdValue',
    },
    sessionId: 'sessionId',
    sessionService: sessionServiceMock,
  } as unknown as Request;

  const resMock = {
    locals: {
      session: {},
    },
  } as unknown as Response;

  const nextMock = jest.fn();

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionTemplateMiddleware,
        ConfigService,
        LoggerService,
        SessionService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    middleware = module.get<SessionTemplateMiddleware>(
      SessionTemplateMiddleware,
    );

    configServiceMock.get.mockReturnValue(configMock);
    sessionServiceMock.get.mockResolvedValue(sessionMock);
    middleware.onModuleInit();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
    expect(loggerServiceMock.setContext).toHaveBeenCalledTimes(1);
  });

  describe('OnModuleInit', () => {
    it('should retrieves the configuration', () => {
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Session');
    });
  });

  describe('use', () => {
    it('should call next if excluded route', async () => {
      await middleware.use(reqMock, resMock, nextMock);
      expect(nextMock).toHaveBeenCalledTimes(1);
    });

    it('should call getSessionParts before next.handle()', async () => {
      // Given
      sessionServiceMock.shouldHandleSession.mockReturnValueOnce(true);
      middleware['getSessionParts'] = jest.fn();

      // When
      await middleware.use(reqMock, resMock, nextMock);

      // Then
      expect(loggerServiceMock.trace).toHaveBeenCalledTimes(1);
      expect(middleware['getSessionParts']).toHaveBeenCalledTimes(1);
      expect(middleware['getSessionParts']).toHaveBeenCalledWith(
        { oidcClient: { foo: true, bar: true } },
        reqMock,
      );
      expect(nextMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('fillObject', () => {
    it('should return partial object', () => {
      // Given
      const source = {
        bar: 'barValue',
        baz: 'bazValue',
        buzz: 'buzzValue',
        wizz: 'wizzValue',
      };
      const target = { bar: true, wizz: true };

      // When
      const result = middleware['fillObject'](target, source);
      // Then
      expect(result).toEqual({ bar: 'barValue', wizz: 'wizzValue' });
    });
  });

  describe('getSessionParts()', () => {
    // Given
    //const contextMock = {};
    it('should return values from session excluding non listed properties', async () => {
      // Given
      const parts = {
        OidcClient: { spName: true },
      };
      // When
      const result = await middleware['getSessionParts'](parts, reqMock);
      // Then
      expect(result).toEqual({
        OidcClient: {
          spName: sessionMock.spName,
        },
      });
    });

    it('should return empty object if no session was found', async () => {
      // Given
      const parts = {
        OidcClient: { spName: true },
      };

      sessionServiceMock.get.mockResolvedValue(undefined);
      // When
      const result = await middleware['getSessionParts'](parts, reqMock);
      // Then
      expect(result).toEqual({});
    });

    it('should return values from session even from multiple session sections', async () => {
      // Given
      const parts = {
        Fizz: { buzz: true },
        Foo: { baz: true },
      };
      sessionServiceMock.get.mockResolvedValue({
        buzz: 'buzzValue',
        wizz: 'wizzValue',
        bar: 'barValue',
        baz: 'bazValue',
      });

      // When
      const result = await middleware['getSessionParts'](parts, reqMock);
      // Then
      expect(result).toEqual({
        Fizz: {
          buzz: 'buzzValue',
        },
        Foo: {
          baz: 'bazValue',
        },
      });
    });
  });
});
