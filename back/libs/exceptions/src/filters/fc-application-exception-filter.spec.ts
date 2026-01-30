import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { BaseException } from '../exceptions';
import { generateErrorId } from '../helpers';
import { FcApplicationExceptionFilter } from './fc-application-exception.filter';

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  generateErrorId: jest.fn(),
}));

describe('FcApplicationExceptionFilter', () => {
  let filter: FcApplicationExceptionFilter;

  let originalErrorMock: Error;

  const configMock = getConfigMock();
  const loggerMock = getLoggerMock();
  const eventBusMock = {
    publish: jest.fn(),
  };
  const generateErrorIdMock = jest.mocked(generateErrorId);

  const codeMock = 1337;
  const idMock = '1234567890';

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FcApplicationExceptionFilter,
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

    filter = module.get<FcApplicationExceptionFilter>(
      FcApplicationExceptionFilter,
    );

    filter['logException'] = jest.fn();
    filter['getExceptionCodeFor'] = jest.fn().mockReturnValue(codeMock);
    generateErrorIdMock.mockReturnValue(idMock);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should generate an error id', () => {
      // Given
      const exception = new BaseException(originalErrorMock);

      // When
      filter.catch(exception);

      // Then
      expect(generateErrorIdMock).toHaveBeenCalledExactlyOnceWith();
    });

    it('should get the exception code', () => {
      // Given
      const exception = new BaseException(originalErrorMock);

      // When
      filter.catch(exception);

      // Then
      expect(filter['getExceptionCodeFor']).toHaveBeenCalledExactlyOnceWith(
        exception,
      );
    });

    it('should log the exception', () => {
      // Given
      const exception = new BaseException(originalErrorMock);

      // When
      filter.catch(exception);

      // Then
      expect(filter['logException']).toHaveBeenCalledExactlyOnceWith(
        codeMock,
        idMock,
        exception,
      );
    });
  });
});
