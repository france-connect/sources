import { ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ViewTemplateService } from '../services';
import { TemplateInterceptor } from './template-method.interceptor';

describe('TemplateInterceptor', () => {
  let interceptor: TemplateInterceptor;

  const resMock = { locals: {} };

  const httpContextMock = {
    getResponse: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  };

  const ViewTemplateServiceMock = {
    bindMethodsToResponse: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [TemplateInterceptor, ViewTemplateService],
    })
      .overrideProvider(ViewTemplateService)
      .useValue(ViewTemplateServiceMock)
      .compile();

    interceptor = module.get<TemplateInterceptor>(TemplateInterceptor);

    httpContextMock.getResponse.mockReturnValue(resMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call getResponse()', () => {
      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(httpContextMock.getResponse).toHaveBeenCalledTimes(1);
    });

    it('should call viewTemplateService.bindMethodsToResponse with Response', () => {
      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(
        ViewTemplateServiceMock.bindMethodsToResponse,
      ).toHaveBeenCalledTimes(1);
      expect(
        ViewTemplateServiceMock.bindMethodsToResponse,
      ).toHaveBeenCalledWith(resMock);
    });

    it('should NOT call viewTemplateService.bindMethodsToResponse if res.locals is not set (non HTTP app)', () => {
      // Given
      const RpcResMock = {};
      httpContextMock.getResponse.mockReset().mockReturnValue(RpcResMock);

      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(
        ViewTemplateServiceMock.bindMethodsToResponse,
      ).not.toHaveBeenCalled();
    });

    it('should call next.handle()', () => {
      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });

    it('should return result of call to next.handle()', () => {
      // Given
      const nextHandleResultMock = Symbol('nextHandleResultMock');
      nextMock.handle.mockReset().mockReturnValueOnce(nextHandleResultMock);
      // When
      const result = interceptor.intercept(contextMock, nextMock);

      // Then
      expect(result).toBe(nextHandleResultMock);
    });
  });
});
