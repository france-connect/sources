import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { FcExceptionFilter } from '@fc/exceptions-deprecated';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { OidcProviderEvents } from '../enums';
import {
  OidcProviderInitialisationException,
  OidcProviderRuntimeException,
} from '../exceptions';
import { OidcCtx } from '../interfaces';
import { OidcProviderErrorService } from './oidc-provider-error.service';

describe('OidcProviderErrorService', () => {
  let service: OidcProviderErrorService;

  const loggerServiceMock = getLoggerMock();

  const exceptionFilterMock = {
    catch: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FcExceptionFilter, OidcProviderErrorService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(FcExceptionFilter)
      .useValue(exceptionFilterMock)
      .compile();

    service = module.get<OidcProviderErrorService>(OidcProviderErrorService);
    jest.resetAllMocks();
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
    it('should call exceptionFilter.catch', async () => {
      // Given
      const ctx = { res: {} } as KoaContextWithOIDC;
      const out = '';
      const error = new Error('foo bar');
      // When
      await service['renderError'](ctx, out, error);
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

  describe('handleRedirectableError', () => {
    const redirectUriMock = 'redirectUriMockValue';
    const ctxMock = {
      res: {
        redirect: jest.fn(),
      },
      oidc: {
        params: {
          // OIDC fashion naming
          // eslint-disable-next-line @typescript-eslint/naming-convention
          redirect_uri: redirectUriMock,
        },
      },
    } as unknown as OidcCtx;

    it('should call res.redirect if exception.redirect is true', () => {
      // Given
      const exceptionMock = {
        redirect: true,
        oidc: {
          error: 'some error',
          description: 'some description',
        },
      } as OidcProviderInitialisationException;

      // When
      service['handleRedirectableError'](ctxMock, exceptionMock);

      // Then
      expect(ctxMock.res.redirect).toHaveBeenCalledTimes(1);
      expect(ctxMock.res.redirect).toHaveBeenCalledWith(
        `${redirectUriMock}?error=${exceptionMock.oidc.error}&error_description=${exceptionMock.oidc.description}`,
      );
    });

    it('should not do anything if exception.redirect is false', () => {
      // Given
      const exceptionMock = {
        redirect: false,
      } as OidcProviderInitialisationException;

      // When
      service['handleRedirectableError'](ctxMock, exceptionMock);

      // Then
      expect(ctxMock.res.redirect).toHaveBeenCalledTimes(0);
    });
  });
});
