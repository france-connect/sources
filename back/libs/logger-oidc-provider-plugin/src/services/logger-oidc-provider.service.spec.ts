import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { AsyncLocalStorageService } from '@fc/async-local-storage';

import { extractClientId } from '../helpers';
import { LoggerOidcProviderService } from './logger-oidc-provider.service';

jest.mock('../helpers');

describe('LoggerOidcProviderService', () => {
  let service: LoggerOidcProviderService;

  const extractClientIdMock = jest.mocked(extractClientId);

  const moduleRefMock = {
    get: jest.fn(),
  };

  const asyncLocalStorageServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerOidcProviderService],
    })
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();

    service = module.get<LoggerOidcProviderService>(LoggerOidcProviderService);

    moduleRefMock.get.mockReturnValue(asyncLocalStorageServiceMock);
  });

  it('should be defined', () => {
    // Then
    expect(service).toBeDefined();
  });

  describe('getContext', () => {
    it('should fetch AsyncLocalStorageService from moduleRef', () => {
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValue(undefined);

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
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValue(undefined);

      // When
      service.getContext();

      // Then
      expect(asyncLocalStorageServiceMock.get).toHaveBeenCalledExactlyOnceWith(
        'request',
      );
    });

    it('should return an empty object when there is no request in the async local storage', () => {
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValue(undefined);

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({});
    });

    it('should return an empty object when the request is null', () => {
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValue(null);

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({});
    });

    it('should extract the clientId from the request', () => {
      // Given
      const requestMock = { query: {}, body: {} };
      asyncLocalStorageServiceMock.get.mockReturnValue(requestMock);

      // When
      service.getContext();

      // Then
      expect(extractClientIdMock).toHaveBeenCalledExactlyOnceWith(requestMock);
    });

    it('should return the extracted clientId', () => {
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValue({});
      extractClientIdMock.mockReturnValue('client-id-mock');

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({ clientId: 'client-id-mock' });
    });

    it('should return an undefined clientId when none could be extracted', () => {
      // Given
      asyncLocalStorageServiceMock.get.mockReturnValue({});
      extractClientIdMock.mockReturnValue(undefined);

      // When
      const result = service.getContext();

      // Then
      expect(result).toEqual({ clientId: undefined });
    });
  });
});
