import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { FcWebHtmlExceptionFilter } from '@fc/exceptions/filters';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import {
  OidcProviderBaseRenderedException,
  OriginalError,
} from '../exceptions';
import { OidcProviderRenderedHtmlExceptionFilter } from './oidc-provider-rendered-html-exception.filter';

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  generateErrorId: jest.fn(),
}));

describe('OidcProviderRenderedHtmlExceptionFilter', () => {
  let filter: OidcProviderRenderedHtmlExceptionFilter;

  const generateErrorIdMock = jest.mocked(generateErrorId);

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const eventBusMock = {
    publish: jest.fn(),
  };

  const hostMock = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn(),
    getResponse: jest.fn(),
  };
  const viewTemplateServiceMock = {};

  class ExceptionMock extends OidcProviderBaseRenderedException {
    ERROR = 'ERROR';
    ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
  }

  let originalErrorMock: Error;
  let exceptionMock: ExceptionMock;

  const resMock = {
    set: jest.fn(),
    status: jest.fn(),
    json: jest.fn(),
  };

  const codeMock = Symbol('code');
  const idMock = Symbol('id');

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderRenderedHtmlExceptionFilter,
        ConfigService,
        LoggerService,
        EventBus,
        ViewTemplateService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .overrideProvider(ViewTemplateService)
      .useValue(viewTemplateServiceMock)
      .compile();

    filter = module.get<OidcProviderRenderedHtmlExceptionFilter>(
      OidcProviderRenderedHtmlExceptionFilter,
    );

    filter['logException'] = jest.fn();
    filter['getExceptionCodeFor'] = jest.fn().mockReturnValue(codeMock);
    filter['errorOutput'] = jest.fn();

    hostMock.switchToHttp.mockReturnThis();
    hostMock.getResponse.mockReturnValue(resMock);
    generateErrorIdMock.mockReturnValue(idMock as unknown as string);

    originalErrorMock = new Error('originalErrorMockValue');
    exceptionMock = new ExceptionMock(originalErrorMock);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    beforeEach(() => {
      filter['shouldNotRedirect'] = jest.fn().mockReturnValue(false);
    });

    it('should exit if the exception is already caught', () => {
      // Given
      exceptionMock.originalError.caught = true;

      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['logException']).not.toHaveBeenCalled();
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    it('should mark the original error as caught', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(exceptionMock.originalError.caught).toBe(true);
    });

    it('should use parent method if shouldNotRedirect returns true', () => {
      // Given
      const spyParent = jest.spyOn(FcWebHtmlExceptionFilter.prototype, 'catch');

      filter['shouldNotRedirect'] = jest.fn().mockReturnValue(true);

      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(spyParent).toHaveBeenCalledOnce();
    });

    it('should log the exception', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['logException']).toHaveBeenCalledExactlyOnceWith(
        codeMock,
        idMock,
        exceptionMock,
      );
    });

    it('should publish an ExceptionCaughtEvent', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(eventBusMock.publish).toHaveBeenCalledExactlyOnceWith(
        expect.any(ExceptionCaughtEvent),
      );
    });
  });

  describe('shouldNotRedirect', () => {
    it('should return false if the exception is not listed', () => {
      // Given
      filter['isListed'] = jest.fn().mockReturnValue(false);

      // When
      const result = filter['shouldNotRedirect'](exceptionMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return true if the exception is listed', () => {
      // Given
      filter['isListed'] = jest.fn().mockReturnValue(true);

      // When
      const result = filter['shouldNotRedirect'](exceptionMock);

      // Then
      expect(result).toBe(true);
    });
  });

  describe('isListed', () => {
    it('should return false if the exception has no originalError', () => {
      // Given
      exceptionMock.originalError = undefined;

      // When
      const result = filter['isListed'](exceptionMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return false if the exception has an originalError but no message', () => {
      // Given
      exceptionMock.originalError = {} as unknown as OriginalError;

      // When
      const result = filter['isListed'](exceptionMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return false if the exception has an originalError with a message but not in the list', () => {
      // Given
      exceptionMock.originalError = {
        error: 'error',
        error_description: 'not in list',
      } as unknown as OriginalError;

      // When
      const result = filter['isListed'](exceptionMock);

      // Then
      expect(result).toBe(false);
    });

    it('should return true if the exception has an originalError with a message in the list', () => {
      // Given
      exceptionMock.originalError = {
        error: 'invalid_client',
        error_description: 'client is invalid',
      } as unknown as OriginalError;

      // When
      const result = filter['isListed'](exceptionMock);

      // Then
      expect(result).toBe(true);
    });

    it('should return true if the exception has an originalError with a message matching a regex in the list', () => {
      // Given
      exceptionMock.originalError = {
        error: 'invalid_request',
        error_description:
          '/unrecognized route or not allowed method (/some/route?foo=bar)',
      } as unknown as OriginalError;

      // When
      const result = filter['isListed'](exceptionMock);

      // Then
      expect(result).toBe(true);
    });
  });
});
