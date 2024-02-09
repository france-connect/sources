import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import { OidcProviderConfigAppService } from './oidc-provider-config-app.service';
import { ScenariosService } from './scenarios.service';

describe('OidcProviderConfigAppService', () => {
  let service: OidcProviderConfigAppService;

  const sessionServiceMock = getSessionServiceMock();
  const errorServiceMock = {
    throwError: jest.fn(),
  };

  const oidcProviderGrantServiceMock = {
    generateGrant: jest.fn(),
    saveGrant: jest.fn(),
  };

  const scenariosServiceMock = {
    deleteClaims: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();
  const configMock = getConfigMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderConfigAppService,
        LoggerService,
        SessionService,
        OidcProviderErrorService,
        OidcProviderGrantService,
        ScenariosService,
        ConfigService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .overrideProvider(OidcProviderGrantService)
      .useValue(oidcProviderGrantServiceMock)
      .overrideProvider(ScenariosService)
      .useValue(scenariosServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<OidcProviderConfigAppService>(
      OidcProviderConfigAppService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatAccount', () => {
    const sessionIdMock = '42';
    const spSubMock = 'the-world';
    const spIdentityMock = {
      sub: spSubMock,
      email: 'dio@brando.it',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      given_name: 'Dio',
      // oidc parameter
      // eslint-disable-next-line @typescript-eslint/naming-convention
      family_name: 'Brando',
    };

    const userLoginMock = 'dbrando';

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      jest
        .spyOn(SessionService, 'getBoundSession')
        .mockReturnValue(sessionServiceMock);
    });

    it('should get the bound app session', async () => {
      // Given
      const reqMock = {
        sessionId: sessionIdMock,
        sessionService: sessionServiceMock,
      };

      // When
      await service['formatAccount'](sessionIdMock, spIdentityMock, spSubMock);

      // Then
      expect(SessionService.getBoundSession).toHaveBeenCalledTimes(1);
      expect(SessionService.getBoundSession).toHaveBeenCalledWith(
        reqMock,
        'App',
      );
    });

    it('should retrieve the current user login in app session', async () => {
      // When
      await service['formatAccount'](sessionIdMock, spIdentityMock, spSubMock);

      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('userLogin');
    });

    it('should call the "deleteClaims" scenario handler with the current login, the sp identity and the sp sub', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(userLoginMock);

      // When
      await service['formatAccount'](sessionIdMock, spIdentityMock, spSubMock);

      // Then
      expect(scenariosServiceMock.deleteClaims).toHaveBeenCalledTimes(1);
      expect(scenariosServiceMock.deleteClaims).toHaveBeenCalledWith(
        userLoginMock,
        spIdentityMock,
        spSubMock,
      );
    });

    it('should return an account for the oidc-provider library to interact with', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(userLoginMock);

      const expected = {
        accountId: sessionIdMock,
        claims: expect.any(Function),
      };

      // When
      const result = await service['formatAccount'](
        sessionIdMock,
        spIdentityMock,
        spSubMock,
      );

      // Then
      expect(result).toStrictEqual(expected);
    });

    it('should return the claims after filtering from "deleteClaims" scenario handler', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(userLoginMock);

      const claimsMock = {
        sub: spSubMock,
        ...spIdentityMock,
      };
      scenariosServiceMock.deleteClaims.mockReturnValue(claimsMock);

      const account = await service['formatAccount'](
        sessionIdMock,
        spIdentityMock,
        spSubMock,
      );

      // When
      const result = await account.claims();

      // Then
      expect(result).toStrictEqual(claimsMock);
    });
  });
});
