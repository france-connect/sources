import { ArgumentsHost } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ApiContentType } from '@fc/app';
import { FcException } from '@fc/exceptions';
import { FcWebHtmlExceptionFilter } from '@fc/exceptions/filters';

import {
  OidcProviderBaseRedirectException,
  OidcProviderBaseRenderedException,
} from '../exceptions';
import {
  OidcProviderRedirectExceptionFilter,
  OidcProviderRenderedHtmlExceptionFilter,
  OidcProviderRenderedJsonExceptionFilter,
} from '../filters';
import { ExceptionOccurredHandler } from './exception-occurred.handler';

describe('ExceptionOccurredHandler', () => {
  let handler: ExceptionOccurredHandler;

  const renderedHtmlMock = {
    catch: jest.fn(),
  };
  const renderedJsonMock = {
    catch: jest.fn(),
  };
  const redirectMock = {
    catch: jest.fn(),
  };
  const webHtmlMock = {
    catch: jest.fn(),
  };

  const hostMock = {
    switchToHttp: jest.fn(),
    getResponse: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExceptionOccurredHandler,
        OidcProviderRenderedHtmlExceptionFilter,
        OidcProviderRenderedJsonExceptionFilter,
        OidcProviderRedirectExceptionFilter,
        FcWebHtmlExceptionFilter,
      ],
    })
      .overrideProvider(OidcProviderRenderedHtmlExceptionFilter)
      .useValue(renderedHtmlMock)
      .overrideProvider(OidcProviderRenderedJsonExceptionFilter)
      .useValue(renderedJsonMock)
      .overrideProvider(OidcProviderRedirectExceptionFilter)
      .useValue(redirectMock)
      .overrideProvider(FcWebHtmlExceptionFilter)
      .useValue(webHtmlMock)
      .compile();

    handler = module.get<ExceptionOccurredHandler>(ExceptionOccurredHandler);
    handler['getContentType'] = jest.fn().mockReturnValue(ApiContentType.HTML);

    hostMock.switchToHttp.mockReturnThis();
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('execute', () => {
    it('should call the redirect filter when the exception is a redirect exception', async () => {
      // Given
      const exceptionMock =
        new (class MockRedirect extends OidcProviderBaseRedirectException {})();

      // When
      await handler.execute({
        exception: exceptionMock,
        host: hostMock as unknown as ArgumentsHost,
      });

      // Then
      expect(redirectMock.catch).toHaveBeenCalledTimes(1);
      expect(redirectMock.catch).toHaveBeenCalledWith(exceptionMock, hostMock);
    });

    it('should call the rendered html filter when the exception is a rendered exception and the content type is html', async () => {
      // Given
      const exceptionMock =
        new (class MockRendered extends OidcProviderBaseRenderedException {})();

      // When
      await handler.execute({
        exception: exceptionMock,
        host: hostMock as unknown as ArgumentsHost,
      });

      // Then
      expect(renderedHtmlMock.catch).toHaveBeenCalledExactlyOnceWith(
        exceptionMock,
        hostMock,
      );
    });

    it('should call the rendered json filter when the exception is a rendered exception and the content type is json', async () => {
      // Given
      const exceptionMock =
        new (class MockRendered extends OidcProviderBaseRenderedException {})();
      handler['getContentType'] = jest
        .fn()
        .mockReturnValue(ApiContentType.JSON);

      // When
      await handler.execute({
        exception: exceptionMock,
        host: hostMock as unknown as ArgumentsHost,
      });

      // Then
      expect(renderedJsonMock.catch).toHaveBeenCalledExactlyOnceWith(
        exceptionMock,
        hostMock,
      );
    });

    it('should call the default filter when the exception of another class', async () => {
      // Given
      const exceptionMock = new (class MockRendered extends FcException {})();
      handler['getContentType'] = jest
        .fn()
        .mockReturnValue(ApiContentType.JSON);

      // When
      await handler.execute({
        exception: exceptionMock,
        host: hostMock as unknown as ArgumentsHost,
      });

      // Then
      expect(webHtmlMock.catch).toHaveBeenCalledExactlyOnceWith(
        exceptionMock,
        hostMock,
      );
    });
  });
});
