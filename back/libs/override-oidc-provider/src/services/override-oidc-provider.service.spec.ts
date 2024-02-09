import * as KeyStore from 'oidc-provider/lib/helpers/keystore.js';
import * as OidcProviderInstance from 'oidc-provider/lib/helpers/weak_cache';

import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcProviderService } from '@fc/oidc-provider';

import { getLoggerMock } from '@mocks/logger';

import { OverrideOidcProviderService } from './override-oidc-provider.service';

jest.mock('oidc-provider/lib/helpers/keystore.js');

describe('OverrideOidcProviderService', () => {
  let service: OverrideOidcProviderService;

  const configMock = {
    get: jest.fn(),
  };

  const loggerMock = getLoggerMock();

  const providerMock = {};
  const oidcProviderMock = {
    getProvider: jest.fn(),
  };

  const moduleRefMock = {
    get: jest.fn(),
  };

  const KeyStoreMock = jest.mocked(KeyStore);
  const signHsmPubKeysMock = [
    {
      x: 'foo',
      y: 'bar',
    },
    {
      x: 'foo2',
      y: 'bar2',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, LoggerService, OverrideOidcProviderService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(ModuleRef)
      .useValue(moduleRefMock)
      .compile();

    service = module.get<OverrideOidcProviderService>(
      OverrideOidcProviderService,
    );

    jest.resetAllMocks();
    oidcProviderMock.getProvider.mockReturnValue(providerMock);
    configMock.get.mockReturnValue({ sigHsmPubKeys: signHsmPubKeysMock });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onApplicationBootstrap', () => {
    it('should call internal initializers', () => {
      // Given
      service['overrideJwksResponse'] = jest.fn();
      // When
      service.onApplicationBootstrap();
      // Then
      expect(service['overrideJwksResponse']).toHaveBeenCalledTimes(1);
    });
  });

  describe('overrideJwksResponse', () => {
    beforeEach(() => {
      service['getOidcProviderService'] = jest
        .fn()
        .mockReturnValueOnce(oidcProviderMock);
    });

    it('should log notice', () => {
      // When
      service['overrideJwksResponse']();

      // Then
      expect(loggerMock.notice).toHaveBeenCalledTimes(1);
      expect(loggerMock.notice).toHaveBeenCalledWith(
        'Overriding JwksResponse of "oidc-provider".',
      );
    });

    it('should create a Key object from config key', () => {
      // Given
      KeyStoreMock.mockImplementationOnce(function (value: any) {
        return value;
      });
      const expectedKeys = [
        {
          ...signHsmPubKeysMock[0],
          d: 'not-a-private',
        },
        {
          ...signHsmPubKeysMock[1],
          d: 'not-a-private',
        },
      ];

      // When
      service['overrideJwksResponse']();

      // Then
      expect(KeyStoreMock).toHaveBeenCalledTimes(1);
      expect(KeyStoreMock).toHaveBeenCalledWith(expectedKeys);
    });

    it('should affect the keystore to provider instance', () => {
      // Given
      const instanceSpy = OidcProviderInstance(providerMock);

      // When
      service['overrideJwksResponse']();

      // Then
      expect(instanceSpy.jwksResponse).toEqual({ keys: signHsmPubKeysMock });
    });
  });

  describe('getOidcProviderService', () => {
    it('should call moduleRef.get with options', () => {
      // When
      service['getOidcProviderService']();
      // Then
      expect(moduleRefMock.get).toBeCalledTimes(1);
      expect(moduleRefMock.get).toBeCalledWith(OidcProviderService, {
        strict: false,
      });
    });
    it('should return result from moduleRef.get', () => {
      // Given
      const mockedReturn = Symbol('someValue');
      moduleRefMock.get.mockReturnValueOnce(mockedReturn);
      // When
      const result = service['getOidcProviderService']();
      // Then
      expect(result).toBe(mockedReturn);
    });
  });
});
