import { Response } from 'express';

import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { SessionService } from '@fc/session';

import { getLoggerMock } from '@mocks/logger';

import { AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

const loggerServiceMock = getLoggerMock();

const sessionServiceMock = {
  reset: jest.fn(),
} as unknown as SessionService;

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OidcProviderController],
      providers: [LoggerService, SessionService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionService)
      .useValue(sessionServiceMock)
      .compile();

    oidcProviderController = app.get<OidcProviderController>(
      OidcProviderController,
    );

    jest.resetAllMocks();
  });

  describe('getAuthorize()', () => {
    const resMock = {} as Response;
    const queryMock = {} as AuthorizeParamsDto;
    const nextMock = jest.fn();

    it('should reset session', async () => {
      // When
      await oidcProviderController.getAuthorize(resMock, nextMock, queryMock);

      // Then
      expect(sessionServiceMock.reset).toHaveReturnedTimes(1);
      expect(sessionServiceMock.reset).toHaveBeenCalledWith(resMock);
    });

    it('should call next', async () => {
      // When
      await oidcProviderController.getAuthorize(resMock, nextMock, queryMock);
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
});
