import { ClientMetadata, KoaContextWithOIDC, Provider } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { SERVICE_PROVIDER_SERVICE_TOKEN } from '@fc/oidc';
import { SessionService } from '@fc/session';

import { OidcProviderRedisAdapter } from '../adapters';
import { OidcProviderService } from '../oidc-provider.service';
import { OidcProviderConfigService } from './oidc-provider-config.service';
import { OidcProviderErrorService } from './oidc-provider-error.service';

describe('OidcProviderConfigService', () => {
  let service: OidcProviderConfigService;

  const loggerServiceMock = {
    setContext: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
    businessEvent: jest.fn(),
  } as unknown as LoggerService;

  const providerMock = {
    middlewares: [],
    use: jest.fn(),
    on: jest.fn(),
    interactionDetails: jest.fn(),
    interactionFinished: jest.fn(),
  } as unknown as Provider;

  const configServiceMock = {
    get: jest.fn(),
  };

  const sessionServiceMock = {
    set: jest.fn(),
    get: jest.fn(),
    getAlias: jest.fn(),
  };

  const errorServiceMock = {
    renderError: jest.fn(),
    throwError: jest.fn(),
  };

  const serviceProviderServiceMock = {
    getById: jest.fn(),
  };

  const oidcProviderRedisAdapterMock = class AdapterMock {};

  const oidcProviderServiceMock = {} as OidcProviderService;

  const configOidcProviderMock = {
    prefix: '/api',
    issuer: 'http://foo.bar',
    configuration: {
      adapter: oidcProviderRedisAdapterMock,
      jwks: { keys: [] },
      features: {
        devInteractions: { enabled: false },
      },
      cookies: {
        keys: ['foo'],
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderConfigService,
        LoggerService,
        ConfigService,
        SessionService,
        OidcProviderErrorService,
        {
          provide: SERVICE_PROVIDER_SERVICE_TOKEN,
          useValue: serviceProviderServiceMock,
        },
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(errorServiceMock)
      .compile();

    module.useLogger(loggerServiceMock);

    service = module.get<OidcProviderConfigService>(OidcProviderConfigService);
    jest.resetAllMocks();

    configServiceMock.get.mockImplementation((module) => {
      switch (module) {
        case 'OidcProvider':
          return configOidcProviderMock;
        case 'Logger':
          return {
            path: '/dev/null',
            level: LoggerLevelNames.TRACE,
            isDevelopment: false,
          };
      }
    });

    service['provider'] = providerMock as any;
  });

  describe('getConfig()', () => {
    it('should call several services and concat their outputs', async () => {
      // Given
      OidcProviderRedisAdapter.getConstructorWithDI = jest
        .fn()
        .mockReturnValue(oidcProviderRedisAdapterMock);

      // When
      const result = await service.getConfig(oidcProviderServiceMock);

      // Then
      expect(
        OidcProviderRedisAdapter.getConstructorWithDI,
      ).toHaveBeenCalledTimes(1);
      expect(
        OidcProviderRedisAdapter.getConstructorWithDI,
      ).toHaveBeenCalledWith(
        oidcProviderServiceMock,
        serviceProviderServiceMock,
      );

      expect(configServiceMock.get).toHaveBeenCalledTimes(1);
      expect(configServiceMock.get).toHaveBeenCalledWith('OidcProvider');

      expect(result).toMatchObject(configOidcProviderMock);
    });

    it('should return false to pkce output if we pass two empty objects', async () => {
      // Given
      OidcProviderRedisAdapter.getConstructorWithDI = jest
        .fn()
        .mockReturnValue(oidcProviderRedisAdapterMock);
      // When
      const result = await service.getConfig(oidcProviderServiceMock);
      const pkceResult = result.configuration.pkce.required({}, {});
      expect(pkceResult).toEqual(false);
    });

    it('should bind methods to config', async () => {
      // When
      const result = await service.getConfig(oidcProviderServiceMock);

      // Then
      expect(result).toHaveProperty(
        'configuration.features.rpInitiatedLogout.logoutSource',
      );
      expect(result).toHaveProperty(
        'configuration.features.rpInitiatedLogout.postLogoutSuccessSource',
      );
      expect(result).toHaveProperty('configuration.findAccount');
      expect(result).toHaveProperty('configuration.pairwiseIdentifier');
      expect(result).toHaveProperty('configuration.renderError');
      expect(result).toHaveProperty('configuration.clientBasedCORS');
      expect(result).toHaveProperty('configuration.interactions.url');
    });
  });

  describe('url()', () => {
    it('Should return a relative interaction url with prefix', async () => {
      // Given
      const prefix = '/prefix';
      const ctx = {
        oidc: {
          entities: {
            interaction: {
              uid: 123,
            },
          },
        },
      } as unknown as KoaContextWithOIDC;
      const { interaction } = ctx.oidc.entities;

      // When
      const result = await service['url'](prefix, ctx, interaction);

      // Then
      expect(result).toEqual('/prefix/interaction/123');
    });
  });

  describe('findAccount()', () => {
    // Given
    const contextMock = { not: 'altered' };
    const interactionIdMock = '123ABC';

    it('Should return an object with accountID', async () => {
      // Given
      const identityMock = { foo: 'bar' };
      sessionServiceMock.get.mockResolvedValueOnce({
        spIdentity: identityMock,
      });
      sessionServiceMock.getAlias.mockResolvedValueOnce({
        identityMock,
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
      // Given
      const identityMock = { foo: 'bar' };
      sessionServiceMock.getAlias.mockResolvedValueOnce({
        identityMock,
      });
      // When
      await service['findAccount'](contextMock, interactionIdMock);
      // Then
      expect(contextMock).toEqual({ not: 'altered' });
    });

    it('Should return an object with a claims function that returns identity', async () => {
      // Given
      const identityMock = { spIdentity: { foo: 'bar' } };
      sessionServiceMock.get.mockResolvedValueOnce({
        spIdentity: identityMock,
      });
      sessionServiceMock.getAlias.mockResolvedValueOnce({
        identityMock,
      });
      const result = await service['findAccount'](
        contextMock,
        interactionIdMock,
      );
      // When
      const claimsResult = await result.claims();
      // Then
      expect(claimsResult).toBe(identityMock);
      expect(contextMock).toEqual({ not: 'altered' });
    });

    it('Should call throwError if an exception is catched', async () => {
      // Given
      const identityMock = { foo: 'bar' };
      const exception = new Error('foo');
      sessionServiceMock.get.mockRejectedValueOnce(exception);
      service['throwError'] = jest.fn();
      sessionServiceMock.getAlias.mockResolvedValueOnce({
        identityMock,
      });
      // When
      await service['findAccount'](contextMock, interactionIdMock);
      // Then
      expect(service['errorService']['throwError']).toHaveBeenCalledWith(
        contextMock,
        exception,
      );
      expect(contextMock).toEqual({ not: 'altered' });
    });
  });

  describe('pairwiseIdentifier()', () => {
    it('should return second argument as is', () => {
      // Given
      const ctx = {};
      const accountId = 'accountIdValue';
      // When
      const result = service['pairwiseIdentifier'](ctx, accountId);
      // Then
      expect(result).toBe(accountId);
    });
  });

  describe('logoutSource()', () => {
    it('should call exceptionFilter.catch', () => {
      // Given
      const ctx = { body: '' } as KoaContextWithOIDC;
      const form = '<form></form>';
      const resultExpected = `<!DOCTYPE html>
      <head>
        <title>Déconnexion</title>
      </head>
      <body>
        <form></form>
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
      service['logoutSource'](ctx, form);

      // Then
      expect(ctx.body).toBe(resultExpected);
    });
  });

  describe('postLogoutSuccessSource()', () => {
    it('should call exceptionFilter.catch', () => {
      // Given
      const ctx = { body: '' } as KoaContextWithOIDC;
      const resultExpected = `<!DOCTYPE html>
      <head>
        <title>Déconnexion</title>
      </head>
      <body>
        <p>Vous êtes bien déconnecté, vous pouvez fermer votre navigateur.</p>
      </body>
      </html>`;

      // When
      service['postLogoutSuccessSource'](ctx);

      // Then
      expect(ctx.body).toBe(resultExpected);
    });
  });

  describe('clientBasedCORS', () => {
    it('Should return false', () => {
      // Given
      const ctx = {} as KoaContextWithOIDC;
      const origin = {};
      const client = {} as ClientMetadata;

      // When
      const result = service['clientBasedCORS'](ctx, origin, client);

      // Then
      expect(result).toBe(false);
    });
  });
});
