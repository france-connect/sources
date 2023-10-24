import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { OidcSession } from '@fc/oidc';
import { OidcClientService } from '@fc/oidc-client';
import {
  OidcCtx,
  OidcProviderErrorService,
  OidcProviderGrantService,
} from '@fc/oidc-provider';
import { ISessionService, SessionService } from '@fc/session';
import { TrackingService } from '@fc/tracking';

import { getSessionServiceMock } from '@mocks/session';

import { CoreFcaMissingAtHashException } from '../exceptions';
import { OidcProviderConfigAppService } from './oidc-provider-config-app.service';

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

  const oidcClientServiceMock = {
    hasEndSessionUrlFromProvider: jest.fn(),
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const atHashMock = 'at_hash Mock value';
  const sessionId = 'sessionIdMock value';

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
  };

  const reqMock = { sessionId };
  const resMock = {};

  const ctxMock = {
    sessionId,
    req: reqMock,
    res: resMock,
    oidc: {
      entities: {
        IdTokenHint: {
          payload: {
            // OIDC defined var name
            // eslint-disable-next-line @typescript-eslint/naming-convention
            at_hash: atHashMock,
          },
        },
      },
    },
  } as unknown as OidcCtx;

  const sessionOidcMock: OidcSession = {
    idpId: 'idp_id',
  };

  const trackingServiceMock = {
    TrackedEventsMap: { SP_REQUESTED_LOGOUT: {} },
    track: jest.fn(),
  };

  const appConfigMock = {
    urlPrefix: '/api/v2',
  };

  const form =
    '<form id="logoutId" method="post" action="https://redirect/me/there"><input type="hidden" name="xsrf" value="123456azerty"/></form>';

  let getBoundSessionMock;

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
        TrackingService,
      ],
    })
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .overrideProvider(OidcProviderGrantService)
      .useValue(oidcProviderGrantServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(TrackingService)
      .useValue(trackingServiceMock)
      .compile();

    service = module.get<OidcProviderConfigAppService>(
      OidcProviderConfigAppService,
    );

    configServiceMock.get.mockReturnValue(appConfigMock);

    getBoundSessionMock = jest.spyOn(SessionService, 'getBoundSession');

    getBoundSessionMock.mockReturnValue(
      sessionServiceMock as unknown as ISessionService<unknown>,
    );

    service['logoutFormSessionDestroy'] = jest.fn();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logoutSource', () => {
    beforeEach(() => {
      service['switchToAliasedSession'] = jest.fn();
    });

    it('should call switchToAliasedSession()', async () => {
      // When
      await service.logoutSource(ctxMock, form);
      // Then
      expect(service['switchToAliasedSession']).toHaveBeenCalledTimes(1);
      expect(service['switchToAliasedSession']).toHaveBeenCalledWith(ctxMock);
    });

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

  describe('switchToAliasedSession', () => {
    it('should throw if at_hash is not found', async () => {
      // Given
      const badCtxMock = {
        oidc: {},
      } as OidcCtx;
      // When
      await expect(
        service['switchToAliasedSession'](badCtxMock),
      ).rejects.toThrow(CoreFcaMissingAtHashException);
    });

    it('should throw if at_hash is not a string', async () => {
      // Given
      const badCtxMock = {
        oidc: {
          // OIDC naming
          // eslint-disable-next-line @typescript-eslint/naming-convention
          entities: { IdTokenHint: { payload: { at_hash: undefined } } },
        },
      } as unknown as OidcCtx;
      // When
      await expect(
        service['switchToAliasedSession'](badCtxMock),
      ).rejects.toThrow(CoreFcaMissingAtHashException);
    });

    it('should call session.getAlias() with value of at_hash', async () => {
      // When
      await service['switchToAliasedSession'](ctxMock);
      // Then
      expect(sessionServiceMock.getAlias).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.getAlias).toHaveBeenLastCalledWith(atHashMock);
    });

    it('should call session.attach() with retrieved sessionId from session.getAlias()', async () => {
      // Given
      const aliasedSessionId = Symbol('aliasedSessionId');
      sessionServiceMock.getAlias.mockResolvedValueOnce(aliasedSessionId);
      // When
      await service['switchToAliasedSession'](ctxMock);
      // Then
      expect(sessionServiceMock.attach).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.attach).toHaveBeenLastCalledWith(
        reqMock,
        resMock,
        aliasedSessionId,
      );
    });
  });
});
