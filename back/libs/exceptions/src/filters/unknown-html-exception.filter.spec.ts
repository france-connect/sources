import { ArgumentsHost } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { ViewTemplateService } from '@fc/view-templates';

import { getConfigMock } from '@mocks/config';
import { getLoggerMock } from '@mocks/logger';

import { BaseException } from '../exceptions';
import { FcWebHtmlExceptionFilter } from './fc-web-html-exception.filter';
import { UnknownHtmlExceptionFilter } from './unknown-html-exception.filter';

describe('UnknownHtmlExceptionFilter', () => {
  let filter: UnknownHtmlExceptionFilter;

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

  let spyParent: jest.SpyInstance;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnknownHtmlExceptionFilter,
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
    filter = module.get<UnknownHtmlExceptionFilter>(UnknownHtmlExceptionFilter);

    spyParent = jest
      .spyOn(FcWebHtmlExceptionFilter.prototype, 'catch')
      .mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  describe('catch', () => {
    it('should call super.catch', () => {
      // Given
      const exceptionMock = new Error('message') as BaseException;

      // When
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // Then
      expect(spyParent).toHaveBeenCalledExactlyOnceWith(
        expect.any(BaseException),
        hostMock,
      );
    });

    it('should wrap the exception', () => {
      // Given
      const exceptionMock = new Error('message') as BaseException;
      filter.catch(exceptionMock, hostMock as unknown as ArgumentsHost);

      // When
      const wrapped = spyParent.mock.calls[0][0] as BaseException;

      // Then
      expect(wrapped.originalError).toBe(exceptionMock);
    });
  });
});