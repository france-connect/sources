import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import { LoggerRequestService } from './logger-request.service';

describe('LoggerRequestService', () => {
  let service: LoggerRequestService;

  const moduleRefMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerRequestService],
    })
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();

    service = module.get<LoggerRequestService>(LoggerRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getContext', () => {
    // Given
    const asyncLocalStorageServiceMock = {
      get: jest.fn(),
    };
    const req = Symbol('req');
    beforeEach(() => {
      moduleRefMock.get.mockReturnValue(asyncLocalStorageServiceMock);
      asyncLocalStorageServiceMock.get.mockReturnValue(req);
    });
    it('should fetch AsyncLocalStorage from moduleRef', () => {
      // When
      service.getContext();

      // Then
      expect(moduleRefMock.get).toHaveBeenCalledExactlyOnceWith(
        AsyncLocalStorageService,
        {
          strict: false,
        },
      );
    });

    it('should fetch request from async local storage', () => {
      // When
      service.getContext();

      // Then
      expect(asyncLocalStorageServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        'request',
      );
    });

    it('should return empty object if request is not found', () => {
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValueOnce(null);

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({});
    });

    it('should return context with method, path and requestId', () => {
      // Given
      const reqMock = {
        headers: {
          'x-request-id': 'requestId',
          'x-forwarded-for': '192.168.1.5',
        },
        ip: '192.168.1.3',
        method: 'GET',
        baseUrl: 'baseUrl',
        path: '/path',
      };
      asyncLocalStorageServiceMock.get.mockReturnValueOnce(reqMock);

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({
        method: 'GET',
        path: 'baseUrl/path',
        requestId: 'requestId',
        ip: '192.168.1.3',
        forwardedFor: '192.168.1.5',
      });
    });
  });
});
