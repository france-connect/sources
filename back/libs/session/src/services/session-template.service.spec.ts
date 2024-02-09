import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getSessionServiceMock } from '@mocks/session';

import { SessionConfig } from '../dto';
import { extractSessionFromRequest } from '../helper';
import { ISessionRequest } from '../interfaces';
import { SessionTemplateService } from './session-template.service';

jest.mock('../helper', () => ({
  extractSessionFromRequest: jest.fn(),
}));

const sessionServiceMock = getSessionServiceMock();

describe('SessionTemplateService', () => {
  let service: SessionTemplateService;

  const extractSessionFromRequestMock = jest.mocked(extractSessionFromRequest);

  const resMock = {
    locals: {
      session: {},
    },
    session: {},
    clearCookie: jest.fn(),
    cookie: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const reqMock = {
    route: {
      path: {},
    },
    sessionId: 'sessionIdValue',
  } as ISessionRequest;

  const sessionMock = {
    spId: 'mockSpId',
    spName: 'mockSpName',
  };

  const httpContextMock = {
    getResponse: jest.fn(),
    getRequest: jest.fn(),
  };

  const oidcClientMock = { foo: true, bar: true };

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
    excludedRoutes: ['/route/66'],
    templateExposed: { oidcClient: oidcClientMock },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionTemplateService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<SessionTemplateService>(SessionTemplateService);
    configServiceMock.get.mockReturnValue(configMock);

    httpContextMock.getResponse.mockReturnValue(resMock);
    httpContextMock.getRequest.mockReturnValue(reqMock);
    sessionServiceMock.get.mockResolvedValue(sessionMock);
    extractSessionFromRequestMock.mockReturnValue(sessionServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('bindSessionToRes', () => {
    const sessionPartsMock = Symbol('sessionPartsMock value');

    beforeEach(() => {
      service['getSessionParts'] = jest
        .fn()
        .mockResolvedValueOnce(sessionPartsMock);
    });

    it('should get templateExposed from config', async () => {
      // When
      await service.bindSessionToRes(reqMock, resMock);
      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call getSessionParts if there are templateExposed', async () => {
      // When
      await service.bindSessionToRes(reqMock, resMock);
      // Then
      expect(service.getSessionParts).toHaveBeenCalledTimes(1);
      expect(service.getSessionParts).toHaveBeenCalledWith(
        configMock.templateExposed,
        reqMock,
      );
    });

    it('should NOT call getSessionParts if there are no templateExposed', async () => {
      // Given
      configServiceMock.get.mockReturnValueOnce({ templateExposed: null });
      // When
      await service.bindSessionToRes(reqMock, resMock);
      // Then
      expect(service.getSessionParts).not.toHaveBeenCalled();
    });

    it('should set res.locals.session to an object containing tempalteExposed parts', async () => {
      // When
      await service.bindSessionToRes(reqMock, resMock);
      // Then
      expect(resMock.locals.session).toBe(sessionPartsMock);
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
      const result = service['fillObject'](target, source);
      // Then
      expect(result).toEqual({ bar: 'barValue', wizz: 'wizzValue' });
    });
  });

  describe('getSessionParts()', () => {
    // Given
    const reqMock = {} as ISessionRequest;
    it('should return values from session excluding non listed properties', async () => {
      // Given
      const parts = {
        OidcClient: { spName: true },
      };
      // When
      const result = await service.getSessionParts(parts, reqMock);
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
      const result = await service.getSessionParts(parts, reqMock);
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
      const result = await service.getSessionParts(parts, reqMock);
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
