import { get } from 'lodash';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';

import { getSessionServiceMock } from '@mocks/session';

import { SessionConfig } from '../dto';
import { SessionService } from './session.service';
import { SessionTemplateService } from './session-template.service';

jest.mock('lodash');
jest.mock('../helper', () => ({
  extractSessionFromRequest: jest.fn(),
}));

const sessionServiceMock = getSessionServiceMock();

describe('SessionTemplateService', () => {
  let service: SessionTemplateService;

  const configServiceMock = {
    get: jest.fn(),
  };

  const getMock = jest.mocked(get);

  const sessionMock = {
    spId: 'mockSpId',
    spName: 'mockSpName',
  };

  const oidcClientMock = { foo: true, bar: true };

  const configMock: Partial<SessionConfig> = {
    sessionCookieName: 'sessionCookieName',
    sessionIdLength: 64,
    middlewareExcludedRoutes: ['/route/66'],
    templateExposed: { oidcClient: oidcClientMock },
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SessionTemplateService, ConfigService, SessionService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    service = module.get<SessionTemplateService>(SessionTemplateService);
    configServiceMock.get.mockReturnValue(configMock);

    sessionServiceMock.get.mockReturnValue(sessionMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get()', () => {
    // Given
    const key = 'key';

    beforeEach(() => {
      service['getSessionParts'] = jest.fn();
    });

    it('should call config.get()', () => {
      // When
      service.get(key);

      // Then
      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('Session');
    });

    it('should call getSessionParts() if templateExposed is truthy', () => {
      // When
      service.get(key);

      // Then
      expect(service['getSessionParts']).toHaveBeenCalledTimes(1);
      expect(service['getSessionParts']).toHaveBeenCalledWith(
        configMock.templateExposed,
      );
    });

    it('should call lodash.get() with sessionParts and key', () => {
      // Given
      const sessionPartsResult = { key: 'value' };
      service['getSessionParts'] = jest
        .fn()
        .mockReturnValue(sessionPartsResult);

      // When
      service.get(key);

      // Then
      expect(getMock).toHaveBeenCalledTimes(1);
      expect(getMock).toHaveBeenCalledWith(sessionPartsResult, key);
    });

    it('should return result from call to lodash.get()', () => {
      // Given
      const lodashGetResult = 'value';
      getMock.mockReturnValue(lodashGetResult);

      // When
      const result = service.get(key);

      // Then
      expect(result).toBe(lodashGetResult);
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
    it('should return values from session excluding non listed properties', async () => {
      // Given
      const parts = {
        OidcClient: { spName: true },
      };
      // When
      const result = await service.getSessionParts(parts);
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

      sessionServiceMock.get.mockReturnValue(undefined);
      // When
      const result = await service.getSessionParts(parts);
      // Then
      expect(result).toEqual({});
    });

    it('should return values from session even from multiple session sections', async () => {
      // Given
      const parts = {
        Fizz: { buzz: true },
        Foo: { baz: true },
      };
      sessionServiceMock.get.mockReturnValue({
        buzz: 'buzzValue',
        wizz: 'wizzValue',
        bar: 'barValue',
        baz: 'bazValue',
      });

      // When
      const result = await service.getSessionParts(parts);
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
