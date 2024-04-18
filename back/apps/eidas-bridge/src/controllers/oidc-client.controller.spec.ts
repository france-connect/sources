import { Test, TestingModule } from '@nestjs/testing';

import { OidcClientService } from '@fc/oidc-client';

import { OidcClientController } from './oidc-client.controller';

describe('OidcClient Controller', () => {
  let controller: OidcClientController;

  const oidcClientServiceMock = {
    utils: {
      getAuthorizeUrl: jest.fn(),
      wellKnownKeys: jest.fn(),
      buildAuthorizeParameters: jest.fn(),
      checkIdpBlacklisted: jest.fn(),
      checkCsrfTokenValidity: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcClientController],
      providers: [OidcClientService],
    })
      .overrideProvider(OidcClientService)
      .useValue(oidcClientServiceMock)
      .compile();

    controller = module.get<OidcClientController>(OidcClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getWellKnownKeys()', () => {
    it('should call oidc-client-service for wellKnownKeys', async () => {
      // When
      await controller.getWellKnownKeys();
      // Then
      expect(oidcClientServiceMock.utils.wellKnownKeys).toHaveBeenCalledTimes(
        1,
      );
    });
  });
});
