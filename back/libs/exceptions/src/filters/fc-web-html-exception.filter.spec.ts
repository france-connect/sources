import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiErrorParams } from '@fc/app';
import { ConfigService } from '@fc/config';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { FcException } from '../exceptions';
import { FcWebHtmlExceptionFilter } from './fc-web-html-exception.filter';

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  generateErrorId: jest.fn(),
}));

describe('FcWebHtmlExceptionFilter', () => {
  let filter: FcWebHtmlExceptionFilter;

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

  const viewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  class ExceptionMock extends FcException {
    ERROR = 'ERROR';
    ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
    HTTP_STATUS_CODE = Symbol('HTTP_STATUS_CODE');
  }

  let exceptionMock: ExceptionMock;

  const resMock = {
    status: jest.fn(),
    render: jest.fn(),
  };

  const codeMock = Symbol('code');
  const idMock = Symbol('id');

  const paramsMock = {
    res: resMock,
    httpResponseCode: 500,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FcWebHtmlExceptionFilter,
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

    filter = module.get<FcWebHtmlExceptionFilter>(FcWebHtmlExceptionFilter);

    filter['logException'] = jest.fn();
    filter['getExceptionCodeFor'] = jest.fn().mockReturnValue(codeMock);

    hostMock.switchToHttp.mockReturnThis();
    hostMock.getResponse.mockReturnValue(resMock);
    generateErrorIdMock.mockReturnValue(idMock as unknown as string);

    resMock.status.mockReturnThis();

    exceptionMock = new ExceptionMock();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    beforeEach(() => {
      filter['shouldNotRedirect'] = jest.fn().mockReturnValue(false);
      filter['getParams'] = jest.fn().mockReturnValue(paramsMock);
      filter['errorOutput'] = jest.fn();
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

    it('should output the error', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(filter['errorOutput']).toHaveBeenCalledExactlyOnceWith(paramsMock);
    });
  });

  describe('errorOutput', () => {
    it('should bind the view template methods to the response', () => {
      // When
      filter['errorOutput'](paramsMock as unknown as ApiErrorParams);

      // Then
      expect(
        viewTemplateServiceMock.bindMethodsToResponse,
      ).toHaveBeenCalledExactlyOnceWith(resMock);
    });

    it('should set the status to 500', () => {
      // When
      filter['errorOutput'](paramsMock as unknown as ApiErrorParams);

      // Then
      expect(resMock.status).toHaveBeenCalledOnce();
      expect(resMock.status).toHaveBeenCalledWith(500);
    });

    it('should render the error template', () => {
      // When
      filter['errorOutput'](paramsMock as unknown as ApiErrorParams);

      // Then
      expect(resMock.render).toHaveBeenCalledExactlyOnceWith(
        'error',
        paramsMock,
      );
    });
  });
});
