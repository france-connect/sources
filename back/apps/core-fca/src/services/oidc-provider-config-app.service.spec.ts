import { KoaContextWithOIDC } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import {
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { ISessionService, SessionService } from '@fc/session';

import { OidcProviderConfigAppService } from './oidc-provider-config-app.service';

describe('OidcProviderConfigAppService', () => {
  let service: OidcProviderConfigAppService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    trace: jest.fn(),
  };

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
  };

  const errorServiceMock = {
    throwError: jest.fn(),
  };

  const oidcProviderGrantServiceMock = {
    generateGrant: jest.fn(),
    saveGrant: jest.fn(),
  };

  const oidcClientServiceMock = {
    hasEndSessionUrlFromProvider: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const ctxMock = {
    sessionId: 'sessionId',
    req: 'toto',
  } as unknown as KoaContextWithOIDC;

  const sessionOidcMock: OidcSession = {
    idpId: 'idp_id',
  };

  const appConfigMock = {
    urlPrefix: '/api/v2',
  };

  const form =
    '<form id="logoutId" method="post" action="https://redirect/me/there"><input type="hidden" name="xsrf" value="123456azerty"/></form>';

  let getBoundedSessionMock;

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
        OidcClientService,
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
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<OidcProviderConfigAppService>(
      OidcProviderConfigAppService,
    );

    configServiceMock.get.mockReturnValue(appConfigMock);

    getBoundedSessionMock = jest.spyOn(SessionService, 'getBoundedSession');

    getBoundedSessionMock.mockReturnValue(
      sessionServiceMock as unknown as ISessionService<unknown>,
    );

    service['logoutFormSessionDestroy'] = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logoutSource', () => {
    it('should call hasEndSessionUrlFromProvider if session & idpId is defined', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValue(sessionOidcMock);
      // When
      await service.logoutSource(ctxMock, form);
      // Then
      expect(
        oidcClientServiceMock.hasEndSessionUrlFromProvider,
      ).toHaveBeenCalledTimes(1);
    });

    it('should call logoutFormSessionDestroy with given parameters if session & idpId is defined and hasEndSessionUrlFromProvider return true', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValue(sessionOidcMock);
      oidcClientServiceMock.hasEndSessionUrlFromProvider.mockResolvedValue(
        true,
      );
      const expectedParamsMock = {
        method: 'POST',
        title: 'Déconnexion du FI',
        uri: '/api/v2/client/disconnect-from-idp',
      };
      // When
      await service.logoutSource(ctxMock, form);
      // Then
      expect(service['logoutFormSessionDestroy']).toHaveBeenCalledTimes(1);
      expect(service['logoutFormSessionDestroy']).toHaveBeenCalledWith(
        ctxMock,
        form,
        sessionServiceMock,
        expectedParamsMock,
      );
    });

    it('should call logoutFormSessionDestroy with given parameters if hasEndSessionUrlFromProvider is false', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValue(sessionOidcMock);
      oidcClientServiceMock.hasEndSessionUrlFromProvider.mockResolvedValue(
        false,
      );
      const expectedParamsMock = {
        method: 'GET',
        title: 'Déconnexion FC',
        uri: '/api/v2/client/logout-callback',
      };
      // When
      await service.logoutSource(ctxMock, form);
      // Then
      expect(service['logoutFormSessionDestroy']).toHaveBeenCalledTimes(1);
      expect(service['logoutFormSessionDestroy']).toHaveBeenCalledWith(
        ctxMock,
        form,
        sessionServiceMock,
        expectedParamsMock,
      );
    });
  });
});
