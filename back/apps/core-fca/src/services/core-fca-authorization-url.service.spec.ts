import { Test, TestingModule } from '@nestjs/testing';

import { OidcClientService } from '@fc/oidc-client';

import {
  CoreFcaDefaultAuthorizationHandler,
  CoreFcaMcpAuthorizationHandler,
} from '../handlers/authorize';
import { CoreFcaAuthorizationUrlService } from './core-fca-authorization-url.service';

describe('CoreFcaAuthorizationUrlService', () => {
  let service: CoreFcaAuthorizationUrlService;

  const defaultHandlerMock = {
    handle: jest.fn(),
  };
  const moncompteproHandlerMock = {
    handle: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreFcaAuthorizationUrlService,
        CoreFcaDefaultAuthorizationHandler,
        CoreFcaMcpAuthorizationHandler,
      ],
    })
      .overrideProvider(CoreFcaDefaultAuthorizationHandler)
      .useValue(defaultHandlerMock)
      .overrideProvider(CoreFcaMcpAuthorizationHandler)
      .useValue(moncompteproHandlerMock)
      .compile();

    service = module.get<CoreFcaAuthorizationUrlService>(
      CoreFcaAuthorizationUrlService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAuthorizeUrl() feature handling', () => {
    it('should call `core-fca-default-authorization-url` with correct params', async () => {
      // Given
      const expectedAuthorizeUrl = 'prefix/authorize';
      defaultHandlerMock.handle.mockReturnValueOnce(expectedAuthorizeUrl);

      const handlerParams = {
        oidcClient: {} as OidcClientService,
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const getAuthorizeUrlParams = {
        ...handlerParams,
        idpFeatureHandlers: {
          fcaAuthorizationUrl: 'core-fca-default-authorization-url',
        },
      };

      await service.getAuthorizeUrl(getAuthorizeUrlParams);

      // Then
      expect(defaultHandlerMock.handle).toBeCalledTimes(1);
      expect(defaultHandlerMock.handle).toBeCalledWith(handlerParams);
    });

    it('should call `core-fca-default-authorization-url` and return a nominal response', async () => {
      // Given
      const expectedAuthorizeUrl = 'prefix/authorize';
      defaultHandlerMock.handle.mockReturnValueOnce(expectedAuthorizeUrl);

      const handlerParams = {
        oidcClient: {} as OidcClientService,
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const getAuthorizeUrlParams = {
        ...handlerParams,
        idpFeatureHandlers: {
          fcaAuthorizationUrl: 'core-fca-default-authorization-url',
        },
      };

      const result = await service.getAuthorizeUrl(getAuthorizeUrlParams);

      // Then
      expect(result).toBe(expectedAuthorizeUrl);
    });

    it('should call `core-fca-mcp-authorization-url` with correct params when service call the function', async () => {
      // Given
      const expectedAuthorizeUrl = 'authorizeWithIsServicePublic';
      moncompteproHandlerMock.handle.mockReturnValueOnce(expectedAuthorizeUrl);

      const handlerParams = {
        oidcClient: {} as OidcClientService,
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const getAuthorizeUrlParams = {
        ...handlerParams,
        idpFeatureHandlers: {
          fcaAuthorizationUrl: 'core-fca-mcp-authorization-url',
        },
      };

      await service.getAuthorizeUrl(getAuthorizeUrlParams);

      // Then
      expect(moncompteproHandlerMock.handle).toBeCalledTimes(1);
      expect(moncompteproHandlerMock.handle).toBeCalledWith(handlerParams);
    });

    it('should call `core-fca-mcp-authorization-url` and return a nominal response', async () => {
      // Given
      const expectedAuthorizeUrl = 'authorizeWithIsServicePublic';
      moncompteproHandlerMock.handle.mockReturnValueOnce(expectedAuthorizeUrl);

      const handlerParams = {
        oidcClient: {} as OidcClientService,
        state: 'state',
        scope: 'scope',
        idpId: 'idpIdExample',
        // acr_values is an oidc defined variable name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        acr_values: 'acr',
        nonce: 'nonce',
        spId: 'spId',
      };

      const getAuthorizeUrlParams = {
        ...handlerParams,
        idpFeatureHandlers: {
          fcaAuthorizationUrl: 'core-fca-mcp-authorization-url',
        },
      };

      const result = await service.getAuthorizeUrl(getAuthorizeUrlParams);

      // Then
      expect(result).toBe(expectedAuthorizeUrl);
    });
  });
});
