import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity, OidcSession } from '@fc/oidc';
import { SessionService, SessionSubNotFoundException } from '@fc/session';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getSessionServiceMock } from '@mocks/session';

import {
  OidcProviderRuntimeException,
  OidcProviderSpIdNotFoundException,
} from '../exceptions';
import { LogoutFormParamsInterface } from '../interfaces';
import { OidcProviderAppConfigLibService } from './oidc-provider-app-config-lib.service';
import { OidcProviderErrorService } from './oidc-provider-error.service';
import { OidcProviderGrantService } from './oidc-provider-grant.service';

describe('OidcProviderAppConfigLibService', () => {
  let service: OidcProviderAppConfigLibService;

  class AppTest extends OidcProviderAppConfigLibService {}

  const sessionServiceMock = getSessionServiceMock();

  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();

  const errorServiceMock = {
    throwError: jest.fn(),
  };

  const oidcProviderGrantServiceMock = {
    generateGrant: jest.fn(),
    saveGrant: jest.fn(),
  };

  const providerMock = {
    interactionFinished: jest.fn(),
  };

  const ctx = {
    request: {
      method: 'POST',
      url: 'https://url.com',
    },
    response: {
      status: 200,
      message: 'OK',
    },
    req: 'toto',
  } as unknown as KoaContextWithOIDC;
  const form =
    '<form id="logoutId" method="post" action="https://redirect/me/there"><input type="hidden" name="xsrf" value="123456azerty"/></form>';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppTest,
        LoggerService,
        SessionService,
        OidcProviderErrorService,
        OidcProviderGrantService,
        ConfigService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .overrideProvider(OidcProviderGrantService)
      .useValue(oidcProviderGrantServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .compile();

    service = module.get<AppTest>(AppTest);

    service['provider'] = providerMock as any;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logoutSource', () => {
    it('should set a body property to koa context', () => {
      // Given
      const htmlDisconnectFromFi = `<!DOCTYPE html>
      <head>
        <title>Déconnexion</title>
      </head>
      <body>
        ${form}
        <script>
          var form = document.forms[0];
          var input = document.createElement('input');
          input.type = 'hidden';
          input.name = 'logout';
          input.value = 'yes';
          form.appendChild(input);
          form.submit();
        </script>
      </body>
    </html>`;
      // When
      service.logoutSource(ctx, form);
      // Then
      expect(ctx).toHaveProperty('body', htmlDisconnectFromFi);
    });
  });

  describe('postLogoutSuccessSource', () => {
    it('should set a body property to koa context', () => {
      // GIVEN
      const ctx = {
        request: {
          method: 'POST',
          url: 'https://url.com',
        },
        response: {
          status: 200,
          message: 'OK',
        },
        req: 'toto',
      } as unknown as KoaContextWithOIDC;

      const htmlPostLogoutSuccessSource = `<!DOCTYPE html>
        <head>
          <title>Déconnexion</title>
        </head>
        <body>
          <p>Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.</p>
        </body>
        </html>`;

      // WHEN
      service.postLogoutSuccessSource(ctx);

      // THEN
      expect(ctx).toHaveProperty('body', htmlPostLogoutSuccessSource);
    });
  });

  describe('findAccount()', () => {
    // Given
    const contextMock = {
      not: 'altered',
    } as unknown as KoaContextWithOIDC;
    const interactionIdMock = '123ABC';
    const identityMock = { foo: 'bar' };

    beforeEach(() => {
      service['getServiceProviderIdFromCtx'] = jest
        .fn()
        .mockReturnValue('clientId');

      sessionServiceMock.initCache.mockResolvedValue(true);
    });

    it('Should return an object with accountID', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce({
        spIdentity: identityMock,
        subs: { clientId: 'sub client id' },
      });
      // When
      const result = await service['findAccount'](
        contextMock,
        interactionIdMock,
      );
      // Then
      expect(result).toHaveProperty('accountId');
      expect(result.accountId).toBe(interactionIdMock);
    });

    it('Should not alter the context', async () => {
      // When
      await service['findAccount'](contextMock, interactionIdMock);
      // Then
      expect(contextMock).toEqual({
        not: 'altered',
      });
    });

    it('Should return an object with a claims function that returns identity', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce({
        spIdentity: identityMock,
        subs: { clientId: 'sub client id' },
      });
      const result = await service['findAccount'](
        contextMock,
        interactionIdMock,
      );
      // When
      const claimsResult = await result.claims();
      // Then
      expect(claimsResult).toStrictEqual({ foo: 'bar', sub: 'sub client id' });
      expect(contextMock).toEqual({
        not: 'altered',
      });
    });

    it('Should return an object with a claims function that returns identity (even with several subs)', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce({
        spIdentity: identityMock,
        subs: {
          clientId: 'sub client id',
          OtherClientId: 'sub other client id',
        },
      });
      const result = await service['findAccount'](
        contextMock,
        interactionIdMock,
      );
      // When
      const claimsResult = await result.claims();
      // Then
      expect(claimsResult).toStrictEqual({ foo: 'bar', sub: 'sub client id' });
      expect(contextMock).toEqual({
        not: 'altered',
      });
    });

    it('Should call throwError if an exception is caught', async () => {
      // Given
      const errorMock = new Error('error');
      sessionServiceMock.initCache.mockRejectedValueOnce(errorMock);
      service['throwError'] = jest.fn();
      // When
      await service['findAccount'](contextMock, interactionIdMock);
      // Then
      expect(service['errorService']['throwError']).toHaveBeenCalledTimes(1);
      expect(service['errorService']['throwError']).toHaveBeenCalledWith(
        contextMock,
        errorMock,
      );
      expect(contextMock).toEqual({
        not: 'altered',
      });
    });

    it('should call checkSpId with ctx and spId found', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce({
        spIdentity: identityMock,
        subs: { clientId: 'sub client id' },
      });
      service['checkSpId'] = jest.fn();
      // When
      await service['findAccount'](contextMock, interactionIdMock);
      // Then
      expect(service['checkSpId']).toHaveBeenCalledTimes(1);
      expect(service['checkSpId']).toHaveBeenCalledWith(
        { not: 'altered' },
        'clientId',
      );
    });

    it('should call checkSub with ctx and sub found', async () => {
      // Given
      sessionServiceMock.get.mockReturnValueOnce({
        spIdentity: identityMock,
        subs: { clientId: 'sub client id' },
      });
      service['checkSub'] = jest.fn();
      // When
      await service['findAccount'](contextMock, interactionIdMock);
      // Then
      expect(service['checkSub']).toHaveBeenCalledTimes(1);
      expect(service['checkSub']).toHaveBeenCalledWith(
        { not: 'altered' },
        'sub client id',
      );
    });
  });

  describe('getServiceProviderIdFromCtx()', () => {
    it('should return the sp client id', () => {
      // Given
      const contextMock = {
        oidc: { entities: { Client: { clientId: 'clientId' } } },
      } as unknown as KoaContextWithOIDC;
      // When
      const result = service['getServiceProviderIdFromCtx'](contextMock);
      // Then
      expect(result).toBe('clientId');
    });
  });

  describe('finishInteraction', () => {
    // Given
    const reqMock = {
      fc: { interactionId: 'interactiondMockValue' },
    };
    const resMock = {};
    const acrMock = Symbol('acrMock');

    const sessionIdMock = 'sessionId';

    beforeEach(() => {
      service['getInteractionAcr'] = jest.fn().mockReturnValue(acrMock);
      sessionServiceMock.getId.mockReturnValue(sessionIdMock);
    });

    it('should return the result of oidc-provider.interactionFinished()', async () => {
      // Given
      const resolvedValue = Symbol('resolved value');

      providerMock.interactionFinished.mockResolvedValueOnce(resolvedValue);
      const sessionDataMock: OidcSession = {
        spAcr: 'spAcrValue',
        spIdentity: {},
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
      // When
      const result = await service.finishInteraction(
        reqMock,
        resMock,
        sessionDataMock,
      );
      // Then
      expect(result).toBe(resolvedValue);
    });

    it('should finish interaction with grant', async () => {
      // Given
      const spAcrMock = 'spAcrValue';
      const interactionIdMock = 'interactionIdValue';
      const amrValueMock = ['amrValue'];
      const spIdentityMock = {
        sub: 'subValue',
      } as IOidcIdentity;

      const sessionDataMock: OidcSession = {
        spAcr: spAcrMock,
        amr: amrValueMock,
        interactionId: interactionIdMock,
        spIdentity: spIdentityMock,
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);

      const grantMock = Symbol('grant');
      const grantIdMock = Symbol('grantIdMock');
      oidcProviderGrantServiceMock.generateGrant.mockResolvedValueOnce(
        grantMock,
      );
      oidcProviderGrantServiceMock.saveGrant.mockResolvedValueOnce(grantIdMock);

      const resultMock = {
        consent: {
          grantId: grantIdMock,
        },
        login: {
          accountId: sessionIdMock,
          acr: acrMock,
          amr: amrValueMock,
          ts: expect.any(Number),
          remember: false,
        },
      };
      providerMock.interactionFinished.mockResolvedValueOnce('ignoredValue');
      // When
      await service.finishInteraction(reqMock, resMock, sessionDataMock);

      // Then
      expect(oidcProviderGrantServiceMock.generateGrant).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcProviderGrantServiceMock.generateGrant).toHaveBeenCalledWith(
        providerMock,
        reqMock,
        resMock,
        sessionIdMock,
      );
      expect(oidcProviderGrantServiceMock.saveGrant).toHaveBeenCalledTimes(1);
      expect(oidcProviderGrantServiceMock.saveGrant).toHaveBeenCalledWith(
        grantMock,
      );

      expect(providerMock.interactionFinished).toHaveBeenCalledTimes(1);
      expect(providerMock.interactionFinished).toHaveBeenCalledWith(
        reqMock,
        resMock,
        resultMock,
      );
    });

    it('should throw OidcProviderRuntimeException', async () => {
      // Given
      const nativeError = new Error('invalid_request');
      providerMock.interactionFinished.mockRejectedValueOnce(nativeError);
      const sessionDataMock: OidcSession = {
        spAcr: 'spAcrValue',
        spIdentity: {},
      };
      sessionServiceMock.get.mockReturnValueOnce(sessionDataMock);
      // Then
      await expect(
        service.finishInteraction(reqMock, resMock, sessionDataMock),
      ).rejects.toThrow(OidcProviderRuntimeException);
    });
  });

  describe('getInteractionAcr()', () => {
    beforeEach(() => {
      configMock.get.mockReturnValue({
        configuration: {
          acrValues: ['spAcrValue', 'idpAcrValue'],
        },
      });
    });

    it('should return the idpAcr value', () => {
      // Given
      const sessionDataMock: OidcSession = {
        spAcr: 'spAcrValue',
        idpAcr: 'idpAcrValue',
      };
      // When
      const result = service['getInteractionAcr'](sessionDataMock);
      // Then
      expect(result).toBe('idpAcrValue');
    });

    it('should return the spAcr value', () => {
      // Given
      const sessionDataMock: OidcSession = {
        spAcr: 'spAcrValue',
        idpAcr: 'idpAcrValueNotInConfig',
      };
      // When
      const result = service['getInteractionAcr'](sessionDataMock);
      // Then
      expect(result).toBe('spAcrValue');
    });
  });

  describe('setProvider()', () => {
    it('should set provider value', () => {
      // Given
      const providerMock = 'providerMock' as unknown as Provider;
      // When
      service.setProvider(providerMock);
      // Then
      expect(service['provider']).toEqual('providerMock');
    });
  });

  describe('checkSpId()', () => {
    it('should throw OidcProviderSpIdNotFoundException if sp id not defined on panva context', async () => {
      // Given
      const spIdMock = undefined;
      const ctxMock = {
        request: {
          method: 'POST',
          url: 'https://url.com',
        },
      } as unknown as KoaContextWithOIDC;
      const exception = new OidcProviderSpIdNotFoundException();
      // When
      await service['checkSpId'](ctxMock, spIdMock);
      // Then
      expect(service['errorService']['throwError']).toHaveBeenCalledWith(
        ctxMock,
        exception,
      );
    });
  });

  describe('checkSub()', () => {
    it('should throw SessionSubNotFoundException if sub not found in session', async () => {
      // Given
      const subMock = undefined;
      const ctxMock = {
        request: {
          method: 'POST',
          url: 'https://url.com',
        },
      } as unknown as KoaContextWithOIDC;
      const exception = new SessionSubNotFoundException();
      // When
      await service['checkSub'](ctxMock, subMock);
      // Then
      expect(service['errorService']['throwError']).toHaveBeenCalledWith(
        ctxMock,
        exception,
      );
    });
  });

  describe('logoutFormSessionDestroy', () => {
    const params: LogoutFormParamsInterface = {
      method: 'method',
      uri: '/uri',
      title: 'Title',
    };

    it('should save oidc logout confirmation form within oidc client session', async () => {
      // Given
      const logoutFormProperty = 'oidcProviderLogoutForm';
      // When
      await service.logoutFormSessionDestroy(ctx, form, params);
      // Then
      expect(sessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.set).toHaveBeenCalledWith(
        'OidcClient',
        logoutFormProperty,
        form,
      );
      expect(sessionServiceMock.commit).toHaveBeenCalledTimes(1);
    });

    it('should commit changes to session', async () => {
      // When
      await service.logoutFormSessionDestroy(ctx, form, params);
      // Then
      expect(sessionServiceMock.commit).toHaveBeenCalledTimes(1);
    });

    it('should set a body property to koa context', async () => {
      // Given
      const htmlDisconnectFromFi = `<!DOCTYPE html>
      <head>
        <title>Title</title>
      </head>
      <body>
        <form method="method" action="/uri">
        </form>
        <script>
          var form = document.forms[0];
          form.submit();
        </script>
      </body>
    </html>`;
      // When
      await service.logoutFormSessionDestroy(ctx, form, params);
      // Then
      expect(ctx).toHaveProperty('body', htmlDisconnectFromFi);
    });
  });
});
