import { Observable, throwError } from 'rxjs';

import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { BaseException, ExceptionCaughtEvent } from '@fc/exceptions';
import { generateErrorId } from '@fc/exceptions/helpers';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { ResponseStatus } from '../enums';
import { MicroservicesRmqExceptionFilter } from './microservices-rmq-exception.filter';

jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  throwError: jest.fn(),
}));

jest.mock('@fc/exceptions/helpers', () => ({
  ...jest.requireActual('@fc/exceptions/helpers'),
  generateErrorId: jest.fn(),
}));

describe('MicroservicesRmqExceptionFilter', () => {
  let filter: MicroservicesRmqExceptionFilter;

  const generateErrorIdMock = jest.mocked(generateErrorId);

  const throwErrorMock = jest.mocked(throwError);
  const throwErrorMockReturnValue = Symbol(
    'throwErrorReturnValue',
  ) as unknown as Observable<never>;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const eventBusMock = {
    publish: jest.fn(),
  };

  const hostMock = {
    switchToRpc: jest.fn().mockReturnThis(),
    getData: jest.fn(),
  };

  class ExceptionMock extends BaseException {
    ERROR = 'ERROR';
    ERROR_DESCRIPTION = 'ERROR_DESCRIPTION';
  }

  let exceptionMock: ExceptionMock;

  const codeMock = Symbol('code');
  const idMock = Symbol('id');

  const messageMock = {
    meta: { message: 'message', code: 'code', id: 'id' },
    type: 'type',
    payload: 'payload',
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MicroservicesRmqExceptionFilter,
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

    filter = module.get<MicroservicesRmqExceptionFilter>(
      MicroservicesRmqExceptionFilter,
    );

    filter['logException'] = jest.fn();
    filter['getExceptionCodeFor'] = jest.fn().mockReturnValue(codeMock);
    filter['errorOutput'] = jest.fn();

    hostMock.switchToRpc.mockReturnThis();
    hostMock.getData.mockReturnValue(messageMock);
    generateErrorIdMock.mockReturnValue(idMock as unknown as string);

    throwErrorMock.mockReturnValue(throwErrorMockReturnValue);

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

    it('should call rxjs.throwError() with a function returning an FSA object', () => {
      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(throwErrorMock).toHaveBeenCalledExactlyOnceWith(
        expect.any(Function),
      );
    });

    it('should call rxjs.throwError() with a function returning an FSA object', () => {
      // Given
      throwErrorMock.mockImplementationOnce((fn) => fn());

      // When
      const result = filter.catch(
        exceptionMock,
        hostMock as unknown as ArgumentsHost,
      );

      // Then
      expect(result).toStrictEqual({
        meta: { message: messageMock, code: codeMock, id: idMock },
        type: ResponseStatus.FAILURE,
        payload: exceptionMock,
      });
    });

    it('should return result of call to rxjs.throwError()', () => {
      // When
      const result = filter.catch(
        exceptionMock,
        hostMock as unknown as ArgumentsHost,
      );

      // Then
      expect(result).toBe(throwErrorMockReturnValue);
    });
  });
});
