import { Request, Response } from 'express';
import Provider from 'oidc-provider';

import { HttpAdapterHost } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcSession } from '@fc/oidc';
import { RedisService } from '@fc/redis';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';
import { getRedisServiceMock } from '@mocks/redis';

import {
  OidcProviderMiddlewarePattern,
  OidcProviderMiddlewareStep,
} from './enums';
import {
  OidcProviderInitialisationException,
  OidcProviderInteractionNotFoundException,
  OidcProviderRuntimeException,
} from './exceptions';
import { COOKIES, OidcProviderService } from './oidc-provider.service';
import { OidcProviderConfigService } from './services/oidc-provider-config.service';
import { OidcProviderErrorService } from './services/oidc-provider-error.service';
import { OIDC_PROVIDER_CONFIG_APP_TOKEN } from './tokens';

describe('OidcProviderService', () => {
  let service: OidcProviderService;

  const loggerMock = getLoggerMock();
  const configMock = getConfigMock();

  const configDataMock = {
    configuration: { jwks: { keys: [] } },
  };
  const httpAdapterHostMock = {
    httpAdapter: {
      use: jest.fn(),
    },
  };

  const ProviderProxyMock = class {
    callback() {
      return true;
    }
  } as any;

  const BadProviderProxyMock = class {
    constructor() {
      throw Error('not Working');
    }
  } as any;

  const configServiceMock = {
    get: jest.fn(),
  };
  const oidcProviderRedisAdapterMock = class AdapterMock {};
  const configOidcProviderMock = {
    prefix: '/api',
    issuer: 'http://foo.bar',
    configuration: {
      adapter: oidcProviderRedisAdapterMock,
      jwks: { keys: [] },
      timeout: 1234,
      features: {
        devInteractions: { enabled: false },
      },
      cookies: {
        keys: ['foo'],
      },
    },
  };

  const serviceProviderListMock = [{ name: 'my SP' }];
  const serviceProviderServiceMock = {
    getList: jest.fn(),
    getById: jest.fn(),
  };

  const useSpy = jest.fn();

  const providerMock = {
    middlewares: [],
    use: (middleware) => {
      providerMock.middlewares.push(middleware);
      useSpy();
    },
    on: jest.fn(),
    interactionDetails: jest.fn(),
    interactionFinished: jest.fn(),
    callback: jest.fn(),
  };

  const redisMock = getRedisServiceMock();

  const oidcProviderErrorServiceMock = {
    catchErrorEvents: jest.fn(),
    throwError: jest.fn(),
  };

  const oidcProviderConfigServiceMock = {
    getConfig: jest.fn(),
    findAccount: jest.fn(),
  };

  const oidcProviderConfigAppMock = {
    setProvider: jest.fn(),
    finishInteraction: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    oidcProviderConfigServiceMock.getConfig.mockReturnValueOnce(
      configOidcProviderMock,
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        OidcProviderService,
        HttpAdapterHost,
        RedisService,
        OidcProviderErrorService,
        OidcProviderConfigService,
        {
          provide: OIDC_PROVIDER_CONFIG_APP_TOKEN,
          useValue: oidcProviderConfigAppMock,
        },
        ConfigService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(RedisService)
      .useValue(redisMock)
      .overrideProvider(HttpAdapterHost)
      .useValue(httpAdapterHostMock)
      .overrideProvider(OidcProviderErrorService)
      .useValue(oidcProviderErrorServiceMock)
      .overrideProvider(OidcProviderConfigService)
      .useValue(oidcProviderConfigServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    service = module.get<OidcProviderService>(OidcProviderService);

    configServiceMock.get.mockImplementation((module) => {
      switch (module) {
        case 'OidcProvider':
          return configOidcProviderMock;
      }
    });

    service['provider'] = providerMock as any;

    serviceProviderServiceMock.getById.mockResolvedValue(
      serviceProviderListMock[0],
    );
    serviceProviderServiceMock.getList.mockResolvedValue(
      serviceProviderListMock,
    );

    configMock.get.mockReturnValue(configDataMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('init', () => {
    it('should throw if provider can not be initialized', () => {
      // Given
      oidcProviderConfigServiceMock.getConfig.mockReturnValueOnce({
        ...configOidcProviderMock,
      });
      service['ProviderProxy'] = BadProviderProxyMock;

      // Then / When
      expect(() => service.init()).toThrow(OidcProviderInitialisationException);
    });

    it('should set provider, with proxy = true', () => {
      // When
      service.init();

      // Then
      expect(service['provider'].proxy).toBe(true);
    });
  });

  describe('onModuleInit', () => {
    beforeEach(() => {
      // Given

      oidcProviderConfigServiceMock.getConfig.mockImplementation(() => ({
        paramsMock: 'paramMocks',
      }));
      service['getConfig'] = jest.fn().mockResolvedValue({
        ...configOidcProviderMock,
      });
      service['registerMiddlewares'] = jest.fn();
      service['catchErrorEvents'] = jest.fn();
      service['init'] = jest.fn();
    });

    it('should call init', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service['init']).toHaveBeenCalledTimes(1);
    });

    it('should call several internal initializers', () => {
      // Given
      service['ProviderProxy'] = ProviderProxyMock;

      // When
      service.onModuleInit();

      // Then
      expect(service['errorService']['catchErrorEvents']).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should call setProvider to allow oidcProviderConfigApp to retrieve this.provider ', () => {
      // Given
      const providerMock = {};

      service['provider'] = providerMock as unknown as Provider;
      // When
      service.onModuleInit();

      // Then
      expect(
        oidcProviderConfigAppMock.setProvider,
      ).toHaveBeenCalledExactlyOnceWith(providerMock);
    });
  });

  describe('getProvider', () => {
    it('should return the oidc-provider instance', () => {
      // When
      const result = service.getProvider();

      // Then
      expect(result).toBe(service['provider']);
    });
  });

  describe('callback', () => {
    const reqMock = {
      originalUrl: '/api/callback',
      url: '/api/callback',
    } as Request;
    const resMock = {} as Response;
    const callbackFunction = jest.fn();
    const callbackResult = Symbol('callbackResult');

    beforeEach(() => {
      providerMock.callback.mockReturnValue(callbackFunction);
      callbackFunction.mockReturnValue(callbackResult);
    });

    it('should call callack with modified url', async () => {
      // When
      await service.callback(reqMock, resMock);

      // Then
      expect(callbackFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/callback',
        }),
        resMock,
      );
    });

    it('should return the result of provider.callback', async () => {
      // When
      const result = await service.callback(reqMock, resMock);

      // Then
      expect(result).toBe(callbackResult);
    });
  });

  describe('fetch', () => {
    it('should set AbortSignal.timeout with configuration timeout and call global fetch', async () => {
      // Given
      const signalMock = Symbol('signalMock') as unknown as AbortSignal;
      const fetchResult = Symbol(
        'fetchResult',
      ) as unknown as globalThis.Response;

      const timeoutSpy = jest
        .spyOn(AbortSignal, 'timeout')
        .mockReturnValueOnce(signalMock);

      const fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(fetchResult);

      const url = 'https://example.com/resource';
      const options: RequestInit = { method: 'GET' };
      service['configuration'] = { timeout: 1234 };

      // When
      const result = await service['fetch'](url, options);

      // Then
      expect(timeoutSpy).toHaveBeenCalledWith(1234);
      expect(options.signal).toBe(signalMock);
      expect(fetchSpy).toHaveBeenCalledWith(url, options);
      expect(result).toBe(fetchResult);
    });
  });

  describe('getInteractionIdFromCtx', () => {
    it('should call getInteractionIdFromCtxSymbol', () => {
      // Given
      const ctxMock = {
        req: { _parsedUrl: { pathname: '/token' } },
        oidc: {
          entities: {
            Grant: {
              accountId: 'accountIdValue',
            },
          },
        },
      };
      // When
      const result = service['getInteractionIdFromCtx'](ctxMock);
      // Then

      expect(result).toEqual('accountIdValue');
    });

    it('should get id from context with /userinfo', () => {
      // Given
      const ctxMock = {
        req: { _parsedUrl: { pathname: '/userinfo' } },
        oidc: {
          entities: {
            Account: {
              accountId: 'accountIdValue',
            },
          },
        },
      };
      // When
      const result = service['getInteractionIdFromCtx'](ctxMock);
      // Then

      expect(result).toEqual('accountIdValue');
    });

    it('should throw', () => {
      // Given
      const ctxMock = { req: { _parsedUrl: { pathname: '/somewhere' } } };
      // When
      expect(() => service['getInteractionIdFromCtx'](ctxMock)).toThrow(
        OidcProviderInteractionNotFoundException,
      );
    });
  });

  describe('registerMiddleware', () => {
    it('should register middleware but not call callback on middleware registration', () => {
      // Given
      providerMock.middlewares = [];
      const callback = jest.fn();
      // When
      service.registerMiddleware(
        OidcProviderMiddlewareStep.BEFORE,
        OidcProviderMiddlewarePattern.USERINFO,
        callback,
      );
      // Then
      expect(useSpy).toBeCalledTimes(1);
      expect(providerMock.middlewares).toHaveLength(1);
      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should call provider use with callback function BEFORE', () => {
      // Given
      providerMock.middlewares = [];
      const callback = jest.fn();
      const ctx = { path: OidcProviderMiddlewarePattern.USERINFO };
      const next = jest.fn().mockResolvedValue(undefined);
      service['runMiddlewareBeforePattern'] = jest.fn();
      // When
      service.registerMiddleware(
        OidcProviderMiddlewareStep.BEFORE,
        OidcProviderMiddlewarePattern.USERINFO,
        callback,
      );
      providerMock.middlewares[0].call(null, ctx, next);
      // Then
      expect(service['runMiddlewareBeforePattern']).toHaveBeenCalledTimes(1);
    });

    it('should call provider use with callback function AFTER', async () => {
      // Given
      providerMock.middlewares = [];
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      const next = jest.fn().mockResolvedValue(undefined);
      service['runMiddlewareAfterPattern'] = jest.fn();
      // When
      service.registerMiddleware(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderMiddlewarePattern.USERINFO,
        callback,
      );
      await providerMock.middlewares[0].call(null, ctx, next);
      // Then
      expect(service['runMiddlewareAfterPattern']).toHaveBeenCalledTimes(1);
    });

    it('should match on path', async () => {
      // Given
      providerMock.middlewares = [];
      const callback = jest.fn();
      const ctx = {
        path: OidcProviderMiddlewarePattern.USERINFO,
      };
      const next = jest.fn().mockResolvedValue(undefined);
      // When
      service.registerMiddleware(
        OidcProviderMiddlewareStep.AFTER,
        OidcProviderMiddlewarePattern.USERINFO,
        callback,
      );
      await providerMock.middlewares[0].call(null, ctx, next);
      // Then
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe('runMiddlewareBeforePattern', () => {
    it('should call the callback if path param equal pattern with good step', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareBeforePattern'](
        {
          step: OidcProviderMiddlewareStep.BEFORE,
          path: OidcProviderMiddlewarePattern.USERINFO,
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback method if wrong path is send', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareBeforePattern'](
        {
          step: OidcProviderMiddlewareStep.BEFORE,
          path: '',
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should not call the callback method if wrong step is send', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareBeforePattern'](
        {
          step: OidcProviderMiddlewareStep.AFTER,
          path: OidcProviderMiddlewarePattern.USERINFO,
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('runMiddlewareAfterPattern', () => {
    it('should call the callback if route param equal pattern with good step', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareAfterPattern'](
        {
          step: OidcProviderMiddlewareStep.AFTER,
          route: OidcProviderMiddlewarePattern.USERINFO,
          path: '',
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should call the callback if path param equal pattern with good step', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareAfterPattern'](
        {
          step: OidcProviderMiddlewareStep.AFTER,
          route: '',
          path: OidcProviderMiddlewarePattern.USERINFO,
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should not call the callback method if wrong step is send', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareAfterPattern'](
        {
          step: OidcProviderMiddlewareStep.BEFORE,
          route: OidcProviderMiddlewarePattern.USERINFO,
          path: OidcProviderMiddlewarePattern.USERINFO,
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should not call the callback method if wrong path or route is send', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO },
      };
      // When
      await service['runMiddlewareAfterPattern'](
        {
          step: OidcProviderMiddlewareStep.BEFORE,
          route: '',
          path: '',
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );
      // Then
      expect(callback).toHaveBeenCalledTimes(0);
    });

    it('should not call the callback method if context indicates an error in oidc interaction', async () => {
      // Given
      const callback = jest.fn();
      const ctx = {
        oidc: { route: OidcProviderMiddlewarePattern.USERINFO, isError: true },
      };

      // When
      await service['runMiddlewareAfterPattern'](
        {
          step: OidcProviderMiddlewareStep.AFTER,
          route: '',
          path: OidcProviderMiddlewarePattern.USERINFO,
          pattern: OidcProviderMiddlewarePattern.USERINFO,
          ctx,
        },
        callback,
      );

      // Then
      expect(callback).toHaveBeenCalledTimes(0);
    });
  });

  describe('getInteraction', () => {
    it('should return the result of oidc-provider.interactionDetails()', async () => {
      // Given
      const reqMock = {};
      const resMock = {};
      const resolvedValue = {
        prompt: {
          name: Symbol('name'),
          reasons: Symbol('reasons'),
        },
      };
      providerMock.interactionDetails.mockResolvedValueOnce(resolvedValue);
      // When
      const result = await service.getInteraction(reqMock, resMock);
      // Then
      expect(result).toBe(resolvedValue);
    });

    it('should throw OidcProviderRuntimeException', async () => {
      // Given
      const reqMock = {};
      const resMock = {};
      const nativeError = new Error('invalid_request');
      providerMock.interactionDetails.mockRejectedValueOnce(nativeError);

      await expect(service.getInteraction(reqMock, resMock)).rejects.toThrow(
        OidcProviderRuntimeException,
      );
    });
  });

  describe('abortInteraction', () => {
    it('should have called this.provider.interactionFinished with parameters if retry params is false', async () => {
      // given
      const resMock = Symbol('mock result');
      const reqMock = Symbol('mock request');
      const mockErr = 'this is an error message';
      const mockErrDescription = 'this is an error description';

      // when
      await service.abortInteraction(reqMock, resMock, {
        error: mockErr,
        error_description: mockErrDescription,
      });

      // then
      expect(providerMock.interactionFinished).toHaveBeenCalledTimes(1);
      expect(providerMock.interactionFinished).toHaveBeenCalledWith(
        reqMock,
        resMock,
        {
          error: mockErr,
          error_description: mockErrDescription,
        },
      );
    });

    it('should have called this.provider.interactionFinished with error undefined if retry params is true', async () => {
      // given
      const resMock = Symbol('mock result');
      const reqMock = Symbol('mock request');

      // when
      await service.abortInteraction(
        reqMock,
        resMock,
        {
          error: 'error',
          error_description: 'error description',
        },
        true,
      );

      // then
      expect(providerMock.interactionFinished).toHaveBeenCalledTimes(1);
      expect(providerMock.interactionFinished).toHaveBeenCalledWith(
        reqMock,
        resMock,
        {
          error: undefined,
        },
      );
    });
  });

  describe('finishInteraction()', () => {
    it('should call call finishInteraction with param', async () => {
      // Given
      const reqMock = Symbol('req');
      const resMock = Symbol('res');
      const sessionDataMock: OidcSession = {
        spAcr: 'spAcrValue',
        spIdentity: {},
      };
      const sessionIdMock = Symbol('sessionId') as unknown as string;
      // When
      await service.finishInteraction(
        reqMock,
        resMock,
        sessionDataMock,
        sessionIdMock,
      );
      // Then
      expect(oidcProviderConfigAppMock.finishInteraction).toHaveBeenCalledTimes(
        1,
      );
      expect(
        oidcProviderConfigAppMock.finishInteraction,
      ).toHaveBeenLastCalledWith(
        reqMock,
        resMock,
        sessionDataMock,
        sessionIdMock,
      );
    });
  });

  describe('getJwks', () => {
    it('should return the jwks from the configuration', () => {
      // When
      const result = service.getJwks();

      // Then
      expect(result).toBe(configOidcProviderMock.configuration.jwks);
    });
  });

  describe('clearCookies', () => {
    it('should iterate over COOKIES and call res.clearCookie with entry from COOKIES', () => {
      // Given
      const resMock = {
        clearCookie: jest.fn(),
      } as unknown as Response;
      // When
      service.clearCookies(resMock);
      // Then
      expect(resMock.clearCookie).toHaveBeenCalledTimes(3);

      expect(resMock.clearCookie).toHaveBeenNthCalledWith(1, COOKIES[0]);
      expect(resMock.clearCookie).toHaveBeenNthCalledWith(2, COOKIES[1]);
      expect(resMock.clearCookie).toHaveBeenNthCalledWith(3, COOKIES[2]);
    });
  });
});
