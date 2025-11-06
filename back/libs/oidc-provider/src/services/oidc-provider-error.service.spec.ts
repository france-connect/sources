import { KoaContextWithOIDC, Provider } from 'oidc-provider';

import { Test, TestingModule } from '@nestjs/testing';

import { throwException } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import {
  OidcProviderInitialisationException,
  OidcProviderNoWrapperException,
} from '../exceptions';
import { OidcProviderBaseRuntimeException } from '../exceptions/oidc-provider-base-runtime.exception';
import { OidcProviderErrorService } from './oidc-provider-error.service';

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  throwException: jest.fn(),
}));

jest.mock('../exceptions/runtime', () => {
  return {
    exceptionSourceMap: {
      'actions/mock-file.js:1': OidcProviderInitialisationException,
    },
  };
});

describe('OidcProviderErrorService', () => {
  let service: OidcProviderErrorService;

  const loggerServiceMock = getLoggerMock();

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [OidcProviderErrorService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<OidcProviderErrorService>(OidcProviderErrorService);
  });

  describe('catchErrorEvents', () => {
    it('should call register event for each error case', () => {
      // Given
      const EVENT_COUNT = 15;
      const provider = { on: jest.fn() as unknown } as Provider;
      // When
      service.catchErrorEvents(provider);
      // Then
      expect(provider.on).toHaveBeenCalledTimes(EVENT_COUNT);
    });
  });

  describe('listenError', () => {
    it('should call renderError', async () => {
      // Given
      service.renderError = jest.fn();
      const ctx = {} as KoaContextWithOIDC;
      const error = new Error('error');
      const eventName = 'event';

      // When
      await service.listenError(eventName, ctx, error);

      // Then
      expect(throwException).toHaveBeenCalledTimes(1);
    });
  });

  describe('renderError', () => {
    let getRenderedExceptionWrapperMock;
    class ExceptionMock extends OidcProviderBaseRuntimeException {}

    beforeEach(() => {
      getRenderedExceptionWrapperMock = jest
        .spyOn(OidcProviderErrorService, 'getRenderedExceptionWrapper')
        .mockReturnValue(ExceptionMock);
    });

    it('should call getRenderedExceptionWrapper', async () => {
      // Given
      const ctx = {} as KoaContextWithOIDC;
      const error = new Error('error');

      // When
      await service.renderError(ctx, '', error);
      // Then
      expect(getRenderedExceptionWrapperMock).toHaveBeenCalledTimes(1);
    });

    it('should set isError flag on ctx.oidc', async () => {
      // Given
      const ctx = { oidc: {} } as KoaContextWithOIDC;
      const error = new Error('error');
      // When
      await service.renderError(ctx, '', error);
      // Then
      expect(ctx.oidc).toHaveProperty('isError', true);
    });

    it('should call throwException', async () => {
      // Given
      const ctx = {} as KoaContextWithOIDC;
      const error = new Error('error');
      // When
      await service.renderError(ctx, '', error);
      // Then
      expect(throwException).toHaveBeenCalledTimes(1);
    });
  });

  describe('getRenderedExceptionWrapper', () => {
    it('should return OidcProviderRuntimeException by default', () => {
      // Given
      const error = new Error('error');

      // When
      const result =
        OidcProviderErrorService.getRenderedExceptionWrapper(error);

      // Then
      expect(result).toBe(OidcProviderNoWrapperException);
    });

    it('should return a specific exception class', () => {
      // Given
      const error = new Error('error');
      error.stack =
        'Error\nnode_modules/oidc-provider/lib/actions/mock-file.js:1:42';

      // When
      const result =
        OidcProviderErrorService.getRenderedExceptionWrapper(error);

      // Then
      expect(result).toBe(OidcProviderInitialisationException);
    });
  });
});
