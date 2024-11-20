import { throwError } from 'rxjs';

import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { BaseException } from '@fc/exceptions';
import { ExceptionCaughtEvent } from '@fc/exceptions/events';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { FcRmqExceptionFilter } from './fc-rmq-exception.filter';

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  generateErrorId: jest.fn(),
}));

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  throwError: jest.fn(),
}));

describe('FcRmqExceptionFilter', () => {
  let filter: FcRmqExceptionFilter;

  const generateErrorIdMock = jest.mocked(generateErrorId);

  const throwErrorMock = jest.mocked(throwError);

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

  class ExceptionMock extends BaseException {
    ERROR = 'ERROR';
    ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
  }

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
        FcRmqExceptionFilter,
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
      .compile();

    filter = module.get<FcRmqExceptionFilter>(FcRmqExceptionFilter);

    filter['logException'] = jest.fn();
    filter['getExceptionCodeFor'] = jest.fn().mockReturnValue(codeMock);
    filter['errorOutput'] = jest.fn();

    hostMock.switchToHttp.mockReturnThis();
    hostMock.getResponse.mockReturnValue(resMock);
    generateErrorIdMock.mockReturnValue(idMock as unknown as string);

    exceptionMock = new ExceptionMock();
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    beforeEach(() => {
      filter['shouldNotRedirect'] = jest.fn().mockReturnValue(false);
    });

    it('should log the exception', () => {
      // When
      filter.catch(exceptionMock);

      // Then
      expect(filter['logException']).toHaveBeenCalledExactlyOnceWith(
        codeMock,
        idMock,
        exceptionMock,
      );
    });

    it('should publish an ExceptionCaughtEvent', () => {
      // When
      filter.catch(exceptionMock);

      // Then
      expect(eventBusMock.publish).toHaveBeenCalledExactlyOnceWith(
        expect.any(ExceptionCaughtEvent),
      );
    });

    it('should call rxjs throwError', () => {
      // When
      filter.catch(exceptionMock);

      // Then
      expect(throwErrorMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(Function),
      );
    });

    it('should call rxjs throwError with a function that returns the exception', () => {
      // Given
      filter.catch(exceptionMock);
      const func = throwErrorMock.mock.calls[0][0];

      // When
      const result = func();

      // Then
      expect(result).toBe(exceptionMock);
    });
  });
});
