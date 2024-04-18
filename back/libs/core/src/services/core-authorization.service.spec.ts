import { ModuleRef } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

import { FeatureHandler } from '@fc/feature-handler';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { OidcClientService } from '@fc/oidc-client';

import { getLoggerMock } from '@mocks/logger';

import {
  CORE_AUTHORIZATION_FEATURE,
  CoreAuthorizationService,
} from './core-authorization.service';

jest.mock('@fc/feature-handler', () => ({
  ...jest.requireActual('@fc/feature-handler'),
  FeatureHandler: {
    get: jest.fn(),
  },
}));

describe('CoreAuthorizationService', () => {
  let service: CoreAuthorizationService;

  const loggerServiceMock = getLoggerMock();

  const oidcClientServiceMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
    },
  };

  const identityProviderAdapterMongoServiceMock = {
    getById: jest.fn(),
  };

  const identityProviderMock = {
    idpLabel: 'idpLabel',
    featureHandlers: {
      [CORE_AUTHORIZATION_FEATURE]: jest.fn(),
    },
  };

  const refModuleMock = {};

  const authorizationHandlerMock = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreAuthorizationService,
        LoggerService,
        IdentityProviderAdapterMongoService,
        OidcClientService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderAdapterMongoServiceMock)
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .overrideProvider(ModuleRef)
      .useValue(refModuleMock)
      .compile();

    service = module.get<CoreAuthorizationService>(CoreAuthorizationService);

    identityProviderAdapterMongoServiceMock.getById.mockResolvedValue(
      identityProviderMock,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorizeUrl()', () => {
    const idpId = 'idpId';
    const parameters = {
      foo: 'bar',
    };
    const allParams = {
      ...parameters,
      bar: 'foo',
    };
    const url = 'url';

    beforeEach(() => {
      jest
        .mocked(FeatureHandler.get)
        .mockReturnValueOnce(authorizationHandlerMock);
      authorizationHandlerMock.handle.mockResolvedValueOnce(allParams);
      oidcClientServiceMock.utils.getAuthorizeUrl.mockResolvedValueOnce(url);
    });

    it('should retrieve the idp given its id', async () => {
      // When
      await service.getAuthorizeUrl(idpId, parameters);

      // Then
      expect(
        identityProviderAdapterMongoServiceMock.getById,
      ).toHaveBeenCalledTimes(1);
      expect(
        identityProviderAdapterMongoServiceMock.getById,
      ).toHaveBeenCalledWith(idpId);
    });

    it('should retrieve the authorization handler from the idp', async () => {
      // When
      await service.getAuthorizeUrl(idpId, parameters);

      // Then
      expect(FeatureHandler.get).toHaveBeenCalledTimes(1);
      expect(FeatureHandler.get).toHaveBeenCalledWith(
        identityProviderMock.featureHandlers[CORE_AUTHORIZATION_FEATURE],
        {
          moduleRef: refModuleMock,
        },
      );
    });

    it('should call the authorization handler with given parameters', async () => {
      // When
      await service.getAuthorizeUrl(idpId, parameters);

      // Then
      expect(authorizationHandlerMock.handle).toHaveBeenCalledTimes(1);
      expect(authorizationHandlerMock.handle).toHaveBeenCalledWith(parameters);
    });

    it('should call the oidc client with the returned parameters', async () => {
      // When
      await service.getAuthorizeUrl(idpId, parameters);

      // Then
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledTimes(
        1,
      );
      expect(oidcClientServiceMock.utils.getAuthorizeUrl).toHaveBeenCalledWith(
        idpId,
        allParams,
      );
    });

    it('should return the url returned by the oidc client', async () => {
      // When
      const result = await service.getAuthorizeUrl(idpId, parameters);

      // Then
      expect(result).toStrictEqual(url);
    });
  });
});
