import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { SessionCsrfService } from '@fc/session';
import { TracksService } from '@fc/tracks';

import { UserDashboardController } from './user-dashboard.controller';

describe('UserDashboardController', () => {
  let controller: UserDashboardController;

  const oidcClientServiceMock = {
    getTokenFromProvider: jest.fn(),
    getUserInfosFromProvider: jest.fn(),
    utils: {
      buildAuthorizeParameters: jest.fn(),
      getAuthorizeUrl: jest.fn(),
      getTokenSet: jest.fn(),
      getUserInfo: jest.fn(),
      revokeToken: jest.fn(),
      wellKnownKeys: jest.fn(),
    },
  };

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const sessionServiceMock = {
    get: jest.fn(),
    set: jest.fn(),
  };

  const interactionIdMock = 'interactionIdMockValue';
  const randomStringMock = 'randomStringMockValue';
  const idpStateMock = 'idpStateMockValue';
  const idpNonceMock = 'idpNonceMock';

  const sessionGenericCsrfServiceMock = {
    get: jest.fn(),
    save: jest.fn(),
    validate: jest.fn(),
  };

  const cryptographyMock = {
    genRandomString: jest.fn(),
  };

  const configMock = {
    get: jest.fn(),
  };

  const tracksServiceMock = {
    getList: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserDashboardController],
      providers: [
        ConfigService,
        LoggerService,
        SessionCsrfService,
        TracksService,
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(SessionCsrfService)
      .useValue(sessionGenericCsrfServiceMock)
      .overrideProvider(TracksService)
      .useValue(tracksServiceMock)
      .compile();

    controller = module.get<UserDashboardController>(UserDashboardController);

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
      providerUid: 'providerUidMock',
      scope: 'scopeMock',
      state: idpStateMock,
    });

    sessionServiceMock.get.mockResolvedValue({
      idpNonce: idpNonceMock,
      idpState: idpStateMock,
      interactionId: interactionIdMock,
    });

    configMock.get.mockReturnValueOnce({
      payloadEncoding: 'base64',
      requestTimeout: 200,
      urlPrefix: '/api/v2',
    });
    cryptographyMock.genRandomString.mockReturnValue(randomStringMock);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCsrfToken', () => {
    const csrfTokenMock = 'csrfTokenMock';
    beforeEach(() => {
      // Given
      sessionGenericCsrfServiceMock.get.mockReturnValueOnce(csrfTokenMock);
    });

    it('should call csrfService.get', async () => {
      // When
      await controller.getCsrfToken(sessionServiceMock);
      // Then
      expect(sessionGenericCsrfServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should call csrfService.save', async () => {
      // When
      await controller.getCsrfToken(sessionServiceMock);
      // Then
      expect(sessionGenericCsrfServiceMock.save).toHaveBeenCalledTimes(1);
      expect(sessionGenericCsrfServiceMock.save).toHaveBeenCalledWith(
        sessionServiceMock,
        csrfTokenMock,
      );
    });

    it('should return csrfToken', async () => {
      // When
      const result = await controller.getCsrfToken(sessionServiceMock);
      // Then
      expect(result).toEqual({ csrfToken: csrfTokenMock });
    });
  });

  describe('getUserTraces', () => {
    it('should fetch session', async () => {
      // When
      await controller.getUserTraces(sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When / Then
      await expect(
        controller.getUserTraces(sessionServiceMock),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call tracks.getList', async () => {
      // Given
      const identityMock = { foo: 'bar' };
      sessionServiceMock.get.mockResolvedValueOnce({
        idpIdentity: identityMock,
      });
      // When
      await controller.getUserTraces(sessionServiceMock);
      // Then
      expect(tracksServiceMock.getList).toHaveBeenCalledTimes(1);
      expect(tracksServiceMock.getList).toHaveBeenCalledWith(identityMock);
    });

    it('should return tracks.getList', async () => {
      // Given
      const resolvedValueMock = 'resolvedValueMock';
      tracksServiceMock.getList.mockResolvedValueOnce(resolvedValueMock);
      // When
      const result = await controller.getUserTraces(sessionServiceMock);
      // Then
      expect(result).toBe(resolvedValueMock);
    });
  });

  describe('getUserInfos', () => {
    it('should fetch session', async () => {
      // When
      await controller.getUserInfos(sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
    });

    it('should throw UnauthorizedException if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When / Then
      await expect(controller.getUserInfos(sessionServiceMock)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return an object with familyName givenName props', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce({
        idpIdentity: {
          // eslint-disable-next-line
          family_name: 'dubois',
          // eslint-disable-next-line
          given_name: 'angela',
        },
      });
      // When
      const { userInfos } = await controller.getUserInfos(sessionServiceMock);
      // Then
      expect(userInfos.givenName).toStrictEqual('angela');
      expect(userInfos.familyName).toStrictEqual('dubois');
    });
  });
});
