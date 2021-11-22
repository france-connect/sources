import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { LoggerService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { FcExceptionFilter } from '@fc/exceptions';

import { OidcProviderEvents } from '../enums';
import {
  OidcProviderInitialisationException,
  OidcProviderRuntimeException,
} from '../exceptions';
import { OidcProviderErrorService } from './oidc-provider-error.service';

describe('OidcProviderErrorService', () => {
  let service: OidcProviderErrorService;

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

  const exceptionFilterMock = {
    catch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcExceptionFilter, OidcProviderErrorService],
    })
      .overrideProvider(FcExceptionFilter)
      .useValue(exceptionFilterMock)
      .compile();

    module.useLogger(loggerServiceMock);

    service = module.get<OidcProviderErrorService>(OidcProviderErrorService);
    jest.resetAllMocks();

    service['provider'] = providerMock as any;
  });

  describe('catchErrorEvents', () => {
    it('should call register event for each error case', () => {
      // Given
      const EVENT_COUNT = 17;
      const provider = { on: jest.fn() as unknown } as Provider;
      // When
      service.catchErrorEvents(provider);
      // Then
      expect(provider.on).toHaveBeenCalledTimes(EVENT_COUNT);
    });
  });

  describe('renderError', () => {
    it('should call exceptionFilter.catch', () => {
      // Given
      const ctx = { res: {} } as KoaContextWithOIDC;
      const out = '';
      const error = new Error('foo bar');
      // When
      service['renderError'](ctx, out, error);
      // Then
      expect(exceptionFilterMock.catch).toHaveBeenCalledTimes(1);
    });
  });

  describe('triggerError', () => {
    it('should call throwError with OidcProviderunTimeException if error is not an FcException', () => {
      // Given
      const eventName = OidcProviderEvents.SESSION_SAVED;
      const func = service['triggerError'].bind(service, eventName);
      const ctxMock = { oidc: {} };
      const errorMock = Error('some error');
      service['throwError'] = jest.fn();
      // When
      func(ctxMock, errorMock);
      // Then
      expect(service['throwError']).toHaveBeenCalledTimes(1);
      expect(service['throwError']).toHaveBeenCalledWith(
        ctxMock,
        expect.any(OidcProviderRuntimeException),
      );
    });
    it('should flag the request as error', () => {
      // Given
      const eventName = OidcProviderEvents.SESSION_SAVED;
      const func = service['triggerError'].bind(service, eventName);
      const ctxMock = { oidc: {} };
      const errorMock = Error('some error');
      service['throwError'] = jest.fn();
      // When
      func(ctxMock, errorMock);
      // Then
      expect(ctxMock.oidc['isError']).toBe(true);
    });
    it('should call throwError with original exception if error is an FcException and does a redirection', () => {
      // Given
      const eventName = OidcProviderEvents.SESSION_SAVED;
      const func = service['triggerError'].bind(service, eventName);
      const ctxMock = { oidc: {} };
      const errorMock = new OidcProviderInitialisationException();
      errorMock.redirect = true;
      service['throwError'] = jest.fn();
      // When
      func(ctxMock, errorMock);
      // Then
      expect(service['throwError']).toHaveBeenCalledTimes(1);
      expect(service['throwError']).toHaveBeenCalledWith(ctxMock, errorMock);
    });
    it('should not call throwError with original exception if error is an FcException and does no redirection', () => {
      // Given
      const eventName = OidcProviderEvents.SESSION_SAVED;
      const func = service['triggerError'].bind(service, eventName);
      const ctxMock = { oidc: {} };
      const errorMock = new OidcProviderInitialisationException();
      errorMock.redirect = false;
      service['throwError'] = jest.fn();
      // When
      func(ctxMock, errorMock);
      // Then
      expect(service['throwError']).toHaveBeenCalledTimes(0);
    });
  });
});
