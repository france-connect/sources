import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { FcWebJsonExceptionFilter } from '@fc/exceptions/filters';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { OidcProviderBaseRenderedException } from '../exceptions';
import { OidcProviderRenderedJsonExceptionFilter } from './oidc-provider-rendered-json-exception.filter';

describe('OidcProviderRenderedJsonExceptionFilter', () => {
  let filter: OidcProviderRenderedJsonExceptionFilter;

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

  class ExceptionMock extends OidcProviderBaseRenderedException {
    ERROR = 'ERROR';
    ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
  }

  let originalErrorMock: Error;
  let exceptionMock: ExceptionMock;

  let spyParent;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OidcProviderRenderedJsonExceptionFilter,
        ConfigService,
        LoggerService,
        EventBus,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(EventBus)
      .useValue(eventBusMock)
      .compile();

    filter = module.get<OidcProviderRenderedJsonExceptionFilter>(
      OidcProviderRenderedJsonExceptionFilter,
    );

    originalErrorMock = new Error('originalErrorMockValue');
    exceptionMock = new ExceptionMock(originalErrorMock);

    spyParent = jest
      .spyOn(FcWebJsonExceptionFilter.prototype, 'catch')
      .mockImplementationOnce(() => {});

    configMock.get.mockReturnValue({
      errorUriBase: 'errorUriBase',
    });
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
      expect(spyParent).not.toHaveBeenCalled();
    });

    it('should mark the original error as caught', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(exceptionMock.originalError.caught).toBe(true);
    });

    it('should call parent method', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(spyParent).toHaveBeenCalledExactlyOnceWith(
        exceptionMock,
        hostMock,
      );
    });
  });

  describe('errorOutput', () => {
    it('should build a standard OAuth2 error response', () => {
      // Given
      const errorParam = {
        httpResponseCode: 400,
        error: { code: 'code', id: 'id' },
        res: { status: jest.fn(), json: jest.fn() },
        exception: {
          error: 'ERROR',
          error_description: 'ERROR_DESCRIPTION',
          error_detail: 'ERROR_DETAIL',
        },
      };

      // When
      filter['errorOutput'](errorParam as unknown as ApiErrorParams);

      // Then
      expect(errorParam.res.status).toHaveBeenCalledWith(400);
      expect(errorParam.res.json).toHaveBeenCalledWith({
        error: 'ERROR',
        error_description: 'ERROR_DESCRIPTION (ERROR_DETAIL)',
        error_uri: 'errorUriBase?code=code&id=id',
      });
    });
  });
});
