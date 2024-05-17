import { ArgumentsHost } from '@nestjs/common';

import { HttpException } from '@fc/exceptions';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getLoggerMock } from '@mocks/logger';

import { HttpExceptionFilter } from './http.exception-filter';

describe('HttpExceptionFilter', () => {
  let exceptionFilter: HttpExceptionFilter;
  const loggerMock = getLoggerMock();

  const resMock: any = {};
  resMock.render = jest.fn().mockReturnValue(resMock);
  resMock.json = jest.fn().mockReturnValue(resMock);
  resMock.status = jest.fn().mockReturnValue(resMock);

  const argumentHostMock = {
    switchToHttp: () => ({
      getResponse: () => resMock,
    }),
  } as ArgumentsHost;

  let configServiceMock;

  const viewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    configServiceMock = {
      get: jest.fn(),
    };

    configServiceMock.get.mockReturnValue({
      apiOutputContentType: 'html',
    });

    exceptionFilter = new HttpExceptionFilter(
      configServiceMock,
      loggerMock as unknown as LoggerService,
      viewTemplateServiceMock as unknown as ViewTemplateService,
    );
  });

  describe('catch()', () => {
    it('should call logException with error code, error id and exception', () => {
      // Given
      const codeMock = 400;
      const exception = new HttpException(
        'Exception from HttpException',
        codeMock,
      );
      exceptionFilter['logException'] = jest.fn();

      // When
      exceptionFilter.catch(exception, argumentHostMock);

      // Then
      expect(exceptionFilter['logException']).toHaveBeenCalledWith(
        `Y000${codeMock}`,
        expect.any(String),
        exception,
      );
    });

    it('should render error template', () => {
      // Given
      const codeMock = 403;
      const exception = new HttpException('message text', codeMock);
      exception.getResponse = jest
        .fn()
        .mockReturnValue({ message: 'some other text' });

      // When
      exceptionFilter.catch(exception, argumentHostMock);

      // Then
      expect(resMock.render).toHaveBeenCalledWith(
        'error',
        expect.objectContaining({
          exception,
          error: {
            code: `Y000${codeMock}`,
            message: 'some other text',
            id: expect.any(String),
          },
        }),
      );
    });
  });
});
