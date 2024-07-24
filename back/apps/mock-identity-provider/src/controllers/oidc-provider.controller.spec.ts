import { Test, TestingModule } from '@nestjs/testing';

import { ISessionService } from '@fc/session';

import { AppSession, AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  const appSessionServiceMock = {
    set: jest.fn(),
  } as unknown as ISessionService<AppSession>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [],
    }).compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );

    jest.resetAllMocks();
  });

  describe('getAuthorize()', () => {
    it('should set the finalSpId into the session', async () => {
      // Given
      const nextMock = jest.fn();
      const queryMock = {
        // Parameter should be like an openid one because it is in the same url
        sp_id: 'abcdefghijklmnopqrstuvwxyz0123456789',
      } as AuthorizeParamsDto;

      // When
      await oidcProviderController.getAuthorize(
        nextMock,
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
      const nextMock = jest.fn();
      const queryMock = {} as AuthorizeParamsDto;

      // When
      await oidcProviderController.getAuthorize(
        nextMock,
        queryMock,
        appSessionServiceMock,
      );

      // Then
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('postAuthorize()', () => {
    it('should call next', () => {
      // Given
      const nextMock = jest.fn();
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      oidcProviderController.postAuthorize(nextMock, bodyMock);
      // Then
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('postToken()', () => {
    it('should call next', () => {
      // Given
      const nextMock = jest.fn();
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      oidcProviderController.postToken(nextMock, bodyMock);
      // Then
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });
});
