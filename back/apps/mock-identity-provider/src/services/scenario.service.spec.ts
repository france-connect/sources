import { readFileSync } from 'fs';

import { mocked } from 'jest-mock';
import { KoaContextWithOIDC } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import * as FcCommon from '@fc/common';
import { ConfigService, validationOptions } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { ScenarioDto } from '../dto';
import { Scenario } from '../enums';
import { ScenariosService } from './scenarios.service';

jest.mock('fs');
/**
 * This code make it possible to spyOn, even with index.ts files
 */
jest.mock('@fc/common', () => {
  return {
    // Jest needs this property
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __esModule: true,
    ...jest.requireActual('@fc/common'),
  };
});

describe('ScenarioService', () => {
  let service: ScenariosService;

  const loggerMock = {
    setContext: jest.fn(),
    warn: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  const scenariosMock = [
    {
      name: '🎵 Music 🎵',
      login: 'dbrando',
      type: Scenario.SERVER_RESPONSE,
      status: 200,
      body: '🎵',
    },
    {
      name: 'Remove 🎵 claims',
      login: 'toto',
      type: Scenario.DELETE_CLAIMS,
      claims: ['🎵'],
    },
  ];

  const scenarioStringMock = JSON.stringify(scenariosMock);

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ScenariosService, LoggerService, ConfigService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<ScenariosService>(ScenariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    const scenariosDatabasePathMock = '/The/trail/we/blaze/🎵';

    beforeEach(() => {
      configMock.get.mockReturnValue({
        scenariosDatabasePath: scenariosDatabasePathMock,
      });

      jest.spyOn(FcCommon, 'asyncFilter');
      jest.spyOn(FcCommon, 'validateDto');
      mocked(readFileSync).mockReturnValue(scenarioStringMock);
    });

    it('should retrieve the scenario database path in config', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(configMock.get).toHaveBeenCalledWith('App');
    });

    it('should read the scenario database file', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(readFileSync).toHaveBeenCalledTimes(1);
      expect(readFileSync).toHaveBeenCalledWith(scenariosDatabasePathMock, {
        encoding: 'utf-8',
      });
    });

    it('should call asyncFilter with parsed scenarios and a callback', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(FcCommon.asyncFilter).toHaveBeenCalledTimes(1);
      expect(FcCommon.asyncFilter).toHaveBeenCalledWith(
        scenariosMock,
        expect.any(Function),
      );
    });

    it('should call validateDto with the scenario and the scenario schema', async () => {
      // When
      await service.onModuleInit();

      // Then
      expect(FcCommon.validateDto).toHaveBeenCalledTimes(2);
      expect(FcCommon.validateDto).toHaveBeenCalledWith(
        scenariosMock[0],
        ScenarioDto,
        validationOptions,
      );
      expect(FcCommon.validateDto).toHaveBeenCalledWith(
        scenariosMock[1],
        ScenarioDto,
        validationOptions,
      );
    });

    it('should set scenarios in the instance with only the first scenario', async () => {
      // Given
      const validationErrorMock = [
        { message: '💩 💩 💩 💩 💩', property: '💩' },
      ];
      mocked(FcCommon.validateDto)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(validationErrorMock);

      // When
      await service.onModuleInit();

      // Then
      expect(service['scenarios']).toStrictEqual([scenariosMock[0]]);
    });
  });

  describe('alterServerResponse', () => {
    const loginMock = 'dbrando';

    beforeEach(() => {
      service['find'] = jest.fn();
    });

    it('should find the scenario, given the login and the type', async () => {
      // Given
      const ctxMock = {} as KoaContextWithOIDC;

      // When
      await service.alterServerResponse(loginMock, ctxMock);

      // Then
      expect(service['find']).toHaveBeenCalledTimes(1);
      expect(service['find']).toHaveBeenCalledWith(
        loginMock,
        Scenario.SERVER_RESPONSE,
      );
    });

    it('should return false if there is no scenario', async () => {
      // Given
      const ctxMock = {} as KoaContextWithOIDC;

      // When
      const result = await service.alterServerResponse(loginMock, ctxMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return true if there is a scenario', async () => {
      // Given
      const ctxMock = {} as KoaContextWithOIDC;
      service['find'] = jest.fn().mockReturnValue({});

      // When
      const result = await service.alterServerResponse(loginMock, ctxMock);

      // Then
      expect(result).toBe(true);
    });

    it('should delay the response if there is a delay in the scenario', async () => {
      // Given
      const ctxMock = {} as KoaContextWithOIDC;
      const scenarioMock = {
        delay: 1000,
      };
      service['find'] = jest.fn().mockReturnValue(scenarioMock);
      jest.spyOn(FcCommon, 'wait').mockResolvedValue(undefined);

      // When
      await service.alterServerResponse(loginMock, ctxMock);

      // Then
      expect(FcCommon.wait).toHaveBeenCalledTimes(1);
      expect(FcCommon.wait).toHaveBeenCalledWith(scenarioMock.delay);
    });

    it('should not delay the response if there is no delay in the scenario', async () => {
      // Given
      const ctxMock = {} as KoaContextWithOIDC;
      const scenarioMock = {};
      service['find'] = jest.fn().mockReturnValue(scenarioMock);
      jest.spyOn(FcCommon, 'wait').mockResolvedValue(undefined);

      // When
      await service.alterServerResponse(loginMock, ctxMock);

      // Then
      expect(FcCommon.wait).not.toHaveBeenCalled();
    });

    it('should set the status and the body in the context', async () => {
      // Given
      const ctxMock = {} as KoaContextWithOIDC;
      const scenarioMock = {
        status: 200,
        body: '🎵',
      };
      service['find'] = jest.fn().mockReturnValue(scenarioMock);

      // When
      await service.alterServerResponse(loginMock, ctxMock);

      // Then
      expect(ctxMock).toStrictEqual({
        status: scenarioMock.status,
        body: scenarioMock.body,
      });
    });
  });

  describe('deleteClaims', () => {
    const loginMock = 'dbrando';
    const subSpMock = 'the-world';
    const spIdentityMock = {
      email: 'dio@brando.it',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'Dio',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'Brando',
    };

    beforeEach(() => {
      service['find'] = jest.fn();
    });

    it('should find the scenario, given the login and the type', () => {
      // When
      service.deleteClaims(loginMock, spIdentityMock, subSpMock);

      // Then
      expect(service['find']).toHaveBeenCalledTimes(1);
      expect(service['find']).toHaveBeenCalledWith(
        loginMock,
        Scenario.DELETE_CLAIMS,
      );
    });

    it('should return unaltered claims if there is no scenario', () => {
      // When
      const result = service.deleteClaims(loginMock, spIdentityMock, subSpMock);

      // Then
      expect(result).toStrictEqual({
        ...spIdentityMock,
        sub: subSpMock,
      });
    });

    it('should return unaltered claims if there is a scenario but no claims', () => {
      // Given
      const scenarioMock = {
        claims: [],
      };
      service['find'] = jest.fn().mockReturnValue(scenarioMock);

      // When
      const result = service.deleteClaims(loginMock, spIdentityMock, subSpMock);

      // Then
      expect(result).toStrictEqual({
        ...spIdentityMock,
        sub: subSpMock,
      });
    });

    it('should return unaltered claims if there is a scenario but no matching claims', () => {
      // Given
      const scenarioMock = {
        claims: ['💩'],
      };
      service['find'] = jest.fn().mockReturnValue(scenarioMock);

      // When
      const result = service.deleteClaims(loginMock, spIdentityMock, subSpMock);

      // Then
      expect(result).toStrictEqual({
        ...spIdentityMock,
        sub: subSpMock,
      });
    });

    it('should return altered claims if there is a scenario and matching claims', () => {
      // Given
      const scenarioMock = {
        claims: ['email', 'given_name'],
      };
      service['find'] = jest.fn().mockReturnValue(scenarioMock);

      // When
      const result = service.deleteClaims(loginMock, spIdentityMock, subSpMock);

      // Then
      expect(result).toStrictEqual({
        sub: subSpMock,
        // oidc claim
        // eslint-disable-next-line @typescript-eslint/naming-convention
        family_name: spIdentityMock.family_name,
      });
    });
  });

  describe('find', () => {
    const loginMock = 'dbrando';
    const typeMock = Scenario.SERVER_RESPONSE;

    beforeEach(() => {
      service['scenarios'] = scenariosMock;
    });

    it('should return the scenario, given the login and the type', () => {
      // When
      const result = service['find'](loginMock, typeMock);

      // Then
      expect(result).toStrictEqual(scenariosMock[0]);
    });

    it('should return undefined if there is no scenario', () => {
      // When
      const result = service['find']('nop', Scenario.DELETE_CLAIMS);

      // Then
      expect(result).toBeUndefined();
    });
  });
});
