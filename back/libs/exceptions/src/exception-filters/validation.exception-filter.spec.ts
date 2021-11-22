import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';

import { FcException, ValidationException } from '../exceptions';
import { ValidationExceptionFilter } from './validation.exception-filter';

describe('ValidationExceptionFilter', () => {
  let exceptionFilter: ValidationExceptionFilter;
  const loggerMock = {
    debug: jest.fn(),
    error: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const apiOutputContentTypeValueMock = 'html';
  const configServiceMock = {} as unknown as ConfigService;
  configServiceMock.get = jest.fn().mockReturnValue({
    apiOutputContentType: apiOutputContentTypeValueMock,
  });

  const resMock: any = {};
  resMock.render = jest.fn().mockReturnValue(resMock);
  resMock.status = jest.fn().mockReturnValue(resMock);

  beforeEach(() => {
    exceptionFilter = new ValidationExceptionFilter(
      configServiceMock,
      loggerMock,
    );
    jest.resetAllMocks();
  });

  describe('catch()', () => {
    it('should log validation errors', () => {
      // Given
      const errors = [];
      const exception = new ValidationException(errors);
      // When
      try {
        exceptionFilter.catch(exception);
        // Then
        expect(loggerMock.error).toHaveBeenCalledWith(errors);
      } catch (e) {
        expect(e).toBeInstanceOf(FcException);
      }

      expect.hasAssertions();
    });

    it('should throw an FcException', () => {
      // Given
      const errors = [];
      const exception = new ValidationException(errors);
      // Then
      expect(() => exceptionFilter.catch(exception)).toThrow(FcException);
    });
  });
});
