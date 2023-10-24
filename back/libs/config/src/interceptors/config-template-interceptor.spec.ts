import { CallHandler, ExecutionContext } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '../config.service';
import { ConfigTemplateInterceptor } from './config-template.interceptor';

describe('ConfigTemplateInterceptor', () => {
  let interceptor: ConfigTemplateInterceptor;

  const resMock: { locals: { config?: unknown } } = {
    locals: {},
  };

  const AppMock = { foo: true, bar: true };

  const configMock = {
    templateExposed: { App: AppMock },
    spId: 'mockSpId',
    spName: 'mockSpName',
  };

  const configServiceMock = {
    get: jest.fn(),
  };

  const httpContextMock = {
    getResponse: jest.fn(),
    getRequest: jest.fn(),
  };

  const contextMock = {
    switchToHttp: () => httpContextMock,
  } as unknown as ExecutionContext;

  const nextMock = {
    handle: jest.fn(),
  } as CallHandler;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigTemplateInterceptor, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .compile();

    interceptor = module.get<ConfigTemplateInterceptor>(
      ConfigTemplateInterceptor,
    );

    configServiceMock.get.mockReturnValue(configMock);
    httpContextMock.getResponse.mockReturnValue(resMock);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  describe('intercept', () => {
    it('should call next.handle() if no config provided', async () => {
      // Given
      configServiceMock.get.mockReset().mockReturnValueOnce({});
      interceptor['getConfigParts'] = jest.fn();

      // When
      await interceptor.intercept(contextMock, nextMock);

      // Then
      expect(interceptor['getConfigParts']).toHaveBeenCalledTimes(0);
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });

    it('should call getConfigParts before next.handle()', () => {
      // Given
      interceptor['getConfigParts'] = jest.fn();

      // When
      interceptor.intercept(contextMock, nextMock);

      // Then
      expect(interceptor['getConfigParts']).toHaveBeenCalledTimes(1);
      expect(interceptor['getConfigParts']).toHaveBeenCalledWith({
        App: { foo: true, bar: true },
      });
      expect(nextMock.handle).toHaveBeenCalledTimes(1);
    });

    it('should set res.locals.config to returned value from call to getConfigParts()', () => {
      // Given
      const getConfigPartsMockedReturn = Symbol(
        'getConfigPartsMockedReturnValue',
      );
      interceptor['getConfigParts'] = jest
        .fn()
        .mockReturnValueOnce(getConfigPartsMockedReturn);
      // When
      interceptor.intercept(contextMock, nextMock);
      // Then
      expect(resMock.locals.config).toBeDefined();
      expect(resMock.locals.config).toBe(getConfigPartsMockedReturn);
    });
  });

  describe('fillObject', () => {
    it('should return partial object', () => {
      // Given
      const source = {
        bar: 'barValue',
        baz: 'bazValue',
        buzz: 'buzzValue',
        wizz: 'wizzValue',
      };
      const target = { bar: true, wizz: true };

      // When
      const result = interceptor['fillObject'](target, source);
      // Then
      expect(result).toEqual({ bar: 'barValue', wizz: 'wizzValue' });
    });
  });

  describe('getConfigParts()', () => {
    // Given
    it('should return values from config excluding non listed properties', async () => {
      // Given
      const parts = {
        App: { spName: true },
      };
      // When
      const result = await interceptor['getConfigParts'](parts);
      // Then
      expect(result).toEqual({
        App: {
          spName: configMock.spName,
        },
      });
    });

    it('should return values from config even from multiple config sections', async () => {
      // Given
      const parts = {
        Fizz: { buzz: true },
        Foo: { baz: true },
      };

      configServiceMock.get.mockReturnValue({
        buzz: 'buzzValue',
        wizz: 'wizzValue',
        bar: 'barValue',
        baz: 'bazValue',
      });

      // When
      const result = await interceptor['getConfigParts'](parts);
      // Then
      expect(result).toEqual({
        Fizz: {
          buzz: 'buzzValue',
        },
        Foo: {
          baz: 'bazValue',
        },
      });
    });
  });
});
