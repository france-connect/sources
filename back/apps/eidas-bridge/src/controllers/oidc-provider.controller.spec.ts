import { Request, Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { OidcProviderService } from '@fc/oidc-provider';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';

import { AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

const loggerServiceMock = getLoggerMock();

const sessionServiceMock = {
  reset: jest.fn(),
} as unknown as SessionService;

const oidcProviderServiceMock = {
  callback: jest.fn(),
} as unknown as OidcProviderService;

describe('OidcProviderController', () => {
  const reqMock = {} as Request;

  const resMock = {} as Response;

  let oidcProviderController: OidcProviderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [LoggerService, SessionService, OidcProviderService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .overrideProvider(OidcProviderService)
      .useValue(oidcProviderServiceMock)
      .compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );

    jest.resetAllMocks();
  });

  describe('getAuthorize()', () => {
    const queryMock = {} as AuthorizeParamsDto;

    it('should reset session', async () => {
      // When
      await oidcProviderController.getAuthorize(reqMock, resMock, queryMock);

      // Then
      expect(sessionServiceMock.reset).toHaveReturnedTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(resMock);
    });

    it('should call next', async () => {
      // When
      await oidcProviderController.getAuthorize(reqMock, resMock, queryMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveReturnedTimes(1);
    });
  });

  describe('postAuthorize()', () => {
    // Given
    const bodyMock = {} as AuthorizeParamsDto;

    it('should reset session', async () => {
      // When
      await oidcProviderController.postAuthorize(reqMock, resMock, bodyMock);

      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledExactlyOnceWith(resMock);
    });

    it('should call next', async () => {
      // When
      await oidcProviderController.postAuthorize(reqMock, resMock, bodyMock);

      // Then
      expect(oidcProviderServiceMock.callback).toHaveReturnedTimes(1);
    });
  });
});
