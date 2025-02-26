import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { OidcProviderBaseRenderedException } from '../exceptions';
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
    exceptionMock.source = 'render';
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should not log nor publish internal message if the exception is already caught', () => {
      // Given
      exceptionMock.originalError.caught = true;

      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['logException']).not.toHaveBeenCalled();
      expect(eventBusMock.publish).not.toHaveBeenCalled();
    });

    it('should call errorOutput() if the exception is already caught', () => {
      // Given
      exceptionMock.originalError.caught = true;
      const paramsMock = Symbol('paramsMock');
      filter['getParams'] = jest.fn().mockReturnValue(paramsMock);

      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['errorOutput']).toHaveBeenCalledExactlyOnceWith(paramsMock);
    });

    it('should mark the original error as caught', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(exceptionMock.originalError.caught).toBe(true);
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

    it('should not create an originalError property if it does not exist', () => {
      // Given
      const simpleExceptionMock = new ExceptionMock();

      // When
      filter.catch(simpleExceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(simpleExceptionMock.originalError).toBeUndefined();
    });
  });
});
