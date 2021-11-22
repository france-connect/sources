import * as KeyStore from 'oidc-provider/lib/helpers/keystore.js';
import * as OidcProviderInstance from 'oidc-provider/lib/helpers/weak_cache';
import { mocked } from 'ts-jest/utils';

import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { OidcProviderService } from '@fc/oidc-provider';

import { OverrideOidcProviderService } from './override-oidc-provider.service';

jest.mock('oidc-provider/lib/helpers/keystore.js');

describe('OverrideOidcProviderService', () => {
  let service: OverrideOidcProviderService;

  const configMock = {
    get: jest.fn(),
  };

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
  } as unknown as LoggerService;

  const providerMock = {};
  const oidcProviderMock = {
    getProvider: jest.fn(),
  };

  const moduleRefMock = {
    get: jest.fn(),
  };

  const KeyStoreMock = mocked(KeyStore);
  const signHsmPubKeyMock = {
    x: 'foo',
    y: 'bar',
  };

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
    configMock.get.mockReturnValue({ sigHsmPubKey: signHsmPubKeyMock });
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

    it('should create a Key object from config key', () => {
      // Given
      KeyStoreMock.mockImplementationOnce(function (value: any) {
        return value;
      });

      // When
      service['overrideJwksResponse']();

      // Then
      expect(KeyStoreMock).toHaveBeenCalledTimes(1);
      expect(KeyStoreMock).toHaveBeenCalledWith([
        {
          ...signHsmPubKeyMock,
          d: 'not-a-private',
        },
      ]);
    });

    it('should affect the keystore to provider instance', () => {
      // Given
      const instanceSpy = OidcProviderInstance(providerMock);

      // When
      service['overrideJwksResponse']();

      // Then
      expect(instanceSpy.jwksResponse).toEqual({ keys: [signHsmPubKeyMock] });
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
