import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { OidcProviderService } from '@fc/oidc-provider';
import { ISessionService } from '@fc/session';

import { AppSession, AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  const appSessionServiceMock = {
    set: jest.fn(),
  } as unknown as ISessionService<AppSession>;

  const oidcProviderServiceMock = {
    callback: jest.fn(),
  } as unknown as OidcProviderService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [OidcProviderService],
    })
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );

    jest.resetAllMocks();
  });

  describe('getAuthorize()', () => {
    it('should set the finalSpId into the session', async () => {
      // Given
      const req = {} as Request;
      const resMock = {} as Response;
      const queryMock = {
        // Parameter should be like an openid one because it is in the same url
        sp_id: 'abcdefghijklmnopqrstuvwxyz0123456789',
      } as AuthorizeParamsDto;

      // When
      await oidcProviderController.getAuthorize(
        req,
        resMock,
        queryMock,
        appSessionServiceMock,
      );

      // Then
      expect(appSessionServiceMock.set).toHaveBeenCalledTimes(1);
      expect(appSessionServiceMock.set).toHaveBeenCalledWith(
        'finalSpId',
        queryMock.sp_id,
      );
    });

    it('should call next', async () => {
      // Given
      const req = {} as Request;
      const resMock = {} as Response;
      const queryMock = {} as AuthorizeParamsDto;

      // When
      await oidcProviderController.getAuthorize(
        req,
        resMock,
        queryMock,
        appSessionServiceMock,
      );

      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledWith(
        req,
        resMock,
      );
    });
  });

  describe('postAuthorize()', () => {
    it('should call next', async () => {
      // Given
      const req = {} as Request;
      const resMock = {} as Response;
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      await oidcProviderController.postAuthorize(req, resMock, bodyMock);
      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledWith(
        req,
        resMock,
      );
    });
  });

  describe('postToken()', () => {
    it('should call next', async () => {
      // Given
      const req = {} as Request;
      const resMock = {} as Response;
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      await oidcProviderController.postToken(req, resMock, bodyMock);
      // Then
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledTimes(1);
      expect(oidcProviderServiceMock.callback).toHaveBeenCalledWith(
        req,
        resMock,
      );
    });
  });
});
