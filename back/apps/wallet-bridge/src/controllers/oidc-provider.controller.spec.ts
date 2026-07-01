import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { OidcSession } from '@fc/oidc';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getSessionServiceMock } from '@mocks/session';

import { AuthorizeParamsDto } from '../dto';
import { WalletBridgeIdentityService } from '../services';
import { OidcProviderController } from './oidc-provider.controller';

const sessionServiceMock = getSessionServiceMock();

const oidcProviderServiceMock = {
  callback: jest.fn(),
};

const identityServiceMock = {
  finishInteraction: jest.fn(),
};

const reqMock = {} as unknown as Request;
const resMock = {} as unknown as Response;

describe('OidcProviderController', () => {
  let controller: OidcProviderController;

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [
        OidcProviderService,
        SessionService,
        WalletBridgeIdentityService,
      ],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(WalletBridgeIdentityService)
      .useValue(identityServiceMock)
      .compile();

    controller = module.get<OidcProviderController>(OidcProviderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAuthorize()', () => {
    const queryMock = {} as AuthorizeParamsDto;

    it('should reset the session', async () => {
      // When
      await controller.getAuthorize(reqMock, resMock, queryMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledExactlyOnceWith(resMock);
    });

    it('should call oidcProvider.callback with req and res', async () => {
      // When
      await controller.getAuthorize(reqMock, resMock, queryMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
      );
    });

    it('should reset session before calling oidcProvider.callback', async () => {
      // When
      await controller.getAuthorize(reqMock, resMock, queryMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledExactlyOnceWith(resMock);
    });
  });

  describe('postAuthorize()', () => {
    const bodyMock = {} as AuthorizeParamsDto;

    it('should reset the session', async () => {
      // When
      await controller.postAuthorize(reqMock, resMock, bodyMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledExactlyOnceWith(resMock);
    });

    it('should call oidcProvider.callback with req and res', async () => {
      // When
      await controller.postAuthorize(reqMock, resMock, bodyMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledExactlyOnceWith(
        reqMock,
        resMock,
      );
    });

    it('should reset session before calling oidcProvider.callback', async () => {
      // When
      await controller.postAuthorize(reqMock, resMock, bodyMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledExactlyOnceWith(resMock);
    });
  });

  describe('getInteraction()', () => {
    it('should call identityService.finishInteraction with req, res and empty session', async () => {
      // When
      await controller.getInteraction(reqMock, resMock);

      // Then
      expect(
        identityServiceMock.finishInteraction,
      ).toHaveBeenCalledExactlyOnceWith(reqMock, resMock, {} as OidcSession);
    });
  });
});
