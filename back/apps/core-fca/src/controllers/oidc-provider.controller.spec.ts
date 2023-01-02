import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger-legacy';
import { SessionService } from '@fc/session';

import { AuthorizeParamsDto } from '../dto';
import { OidcProviderController } from './oidc-provider.controller';

describe('OidcProviderController', () => {
  let oidcProviderController: OidcProviderController;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceMock = {
    reset: jest.fn(),
  };
  const sessionIdMock = 'session-id-mock';

  const reqMock = Symbol('req');
  const resMock = Symbol('res');

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

    oidcProviderController = await app.get<OidcProviderController>(
      OidcProviderController,
    );

    jest.resetAllMocks();

    sessionServiceMock.reset.mockResolvedValueOnce(sessionIdMock);
  });

  describe('getAuthorize()', () => {
    it('should call next', async () => {
      // Given
      const nextMock = jest.fn();
      const queryMock = {} as AuthorizeParamsDto;
      // When
      await oidcProviderController.getAuthorize(
        reqMock,
        resMock,
        nextMock,
        queryMock,
      );
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });

  describe('postAuthorize()', () => {
    it('should call next', async () => {
      // Given
      const nextMock = jest.fn();
      const bodyMock = {} as AuthorizeParamsDto;
      // When
      await oidcProviderController.postAuthorize(
        reqMock,
        resMock,
        nextMock,
        bodyMock,
      );
      // Then
      expect(sessionServiceMock.reset).toHaveBeenCalledTimes(1);
      expect(nextMock).toHaveReturnedTimes(1);
    });
  });
});
