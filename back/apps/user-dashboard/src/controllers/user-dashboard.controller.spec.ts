import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationResult } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import {
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
} from '@fc/session';
import { TrackDto, TracksService } from '@fc/tracks';
import { FormattedIdpDto, UserPreferencesService } from '@fc/user-preferences';

import { GetUserTracesQueryDto } from '../dto';
import { UserDashboardService } from '../services';
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

  const randomStringMock = 'randomStringMockValue';
  const idpStateMock = 'idpStateMockValue';
  const identityMock = {
    email: 'email@email.fr',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'givenName',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'familyName',
  };

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

  const userPreferencesMock = {
    getUserPreferencesList: jest.fn(),
    setUserPreferencesList: jest.fn(),
  };

  const updatePreferencesBodyMock = {
    idpList: [],
    csrfToken: 'csrfTokenMockValue',
    allowFutureIdp: false,
  };

  const userDashboardServiceMock = {
    sendMail: jest.fn(),
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
        UserPreferencesService,
        UserDashboardService,
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
      .overrideProvider(UserPreferencesService)
      .useValue(userPreferencesMock)
      .overrideProvider(UserDashboardService)
      .useValue(userDashboardServiceMock)
      .compile();

    controller = module.get<UserDashboardController>(UserDashboardController);

    oidcClientServiceMock.utils.buildAuthorizeParameters.mockReturnValue({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      acr_values: 'acrMock',
      providerUid: 'providerUidMock',
      scope: 'scopeMock',
      state: idpStateMock,
    });

    sessionServiceMock.get.mockResolvedValue(identityMock);

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
    const queryMock: GetUserTracesQueryDto = {
      offset: 0,
      size: 42,
    };

    const claimMock = {
      identifier: 'identifierValue',
      label: 'labelValue',
      provider: { key: 'keyValue', label: 'labelValue' },
    };

    const listTracks: { meta: IPaginationResult; payload: TrackDto[] } = {
      meta: {
        total: 2,
        offset: 0,
        size: 10,
      },
      payload: [
        {
          event: 'eventValue',
          idpLabel: 'idpLabelValue',
          platform: 'platformValue',
          spAcr: 'eidas1',
          spLabel: 'spLabelValue',
          time: 11233335550000,
          trackId: 'trackIdValue',
          claims: [claimMock],
        },
      ],
    };

    beforeEach(() => {
      tracksServiceMock.getList.mockResolvedValueOnce(listTracks);
    });

    it('should fetch session', async () => {
      // When
      await controller.getUserTraces(sessionServiceMock, queryMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should throw UnauthorizedException if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When / Then
      await expect(
        controller.getUserTraces(sessionServiceMock, queryMock),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call tracks.getList', async () => {
      // When
      await controller.getUserTraces(sessionServiceMock, queryMock);
      // Then
      expect(tracksServiceMock.getList).toHaveBeenCalledTimes(1);
      expect(tracksServiceMock.getList).toHaveBeenCalledWith(
        identityMock,
        queryMock,
      );
    });

    it('should return tracks.getList', async () => {
      // When
      const result = await controller.getUserTraces(
        sessionServiceMock,
        queryMock,
      );
      // Then
      expect(result).toStrictEqual({
        ...listTracks,
        type: 'TRACKS_DATA',
      });
    });
  });

  describe('getUserInfos', () => {
    it('should fetch session', async () => {
      // When
      await controller.getUserInfos(sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
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
      sessionServiceMock.get.mockResolvedValueOnce(identityMock);
      // When
      const { firstname, lastname } = await controller.getUserInfos(
        sessionServiceMock,
      );
      // Then
      expect(firstname).toStrictEqual(identityMock.given_name);
      expect(lastname).toStrictEqual(identityMock.family_name);
    });
  });

  describe('getUserPreferences', () => {
    it('should fetch session', async () => {
      // When
      await controller.getUserPreferences(sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should throw UnauthorizedException if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When / Then
      await expect(
        controller.getUserPreferences(sessionServiceMock),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call userPreferences.getUserPreferencesList', async () => {
      // When
      await controller.getUserPreferences(sessionServiceMock);
      // Then
      expect(userPreferencesMock.getUserPreferencesList).toHaveBeenCalledTimes(
        1,
      );
      expect(userPreferencesMock.getUserPreferencesList).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should return userPreferences.getUserPreferencesList', async () => {
      // Given
      const formattedIdpSettingsMock: Partial<FormattedIdpDto> = {
        uid: 'uid',
        isChecked: true,
      };
      const resolvedUserPreferencesMock = {
        idpList: formattedIdpSettingsMock,
        allowFutureIdp: true,
      };
      userPreferencesMock.getUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );
      // When
      const result = await controller.getUserPreferences(sessionServiceMock);
      // Then
      expect(result).toStrictEqual({
        idpList: formattedIdpSettingsMock,
        allowFutureIdp: true,
      });
    });
  });

  describe('updateUserPreferences', () => {
    const formattedIdpSettingsMock: Partial<FormattedIdpDto> = {
      uid: 'uid',
      isChecked: false,
    };

    const resolvedUserPreferencesMock = {
      idpList: formattedIdpSettingsMock,
      allowFutureIdp: false,
      updatedIdpSettingsList: formattedIdpSettingsMock,
      hasAllowFutureIdpChanged: true,
      updatedAt: 'updatedAt',
    };

    it('should fetch session', async () => {
      // Given
      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );

      // When
      await controller.updateUserPreferences(
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should throw UnauthorizedException if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When / Then
      await expect(
        controller.updateUserPreferences(
          updatePreferencesBodyMock,
          sessionServiceMock,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should call userPreferences.setUserPreferencesList', async () => {
      // Given
      const { allowFutureIdp, idpList } = updatePreferencesBodyMock;
      const expectedServicedArguments = { allowFutureIdp, idpList };

      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );

      // When
      await controller.updateUserPreferences(
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(userPreferencesMock.setUserPreferencesList).toHaveBeenCalledTimes(
        1,
      );
      expect(userPreferencesMock.setUserPreferencesList).toHaveBeenCalledWith(
        identityMock,
        expectedServicedArguments,
      );
    });

    it('should return userPreferences.setUserPreferencesList', async () => {
      // Given
      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );
      // When
      const result = await controller.updateUserPreferences(
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(result).toStrictEqual({
        idpList: formattedIdpSettingsMock,
        allowFutureIdp: updatePreferencesBodyMock.allowFutureIdp,
        updatedIdpSettingsList: formattedIdpSettingsMock,
        hasAllowFutureIdpChanged: true,
        updatedAt: 'updatedAt',
      });
    });
  });

  it('should fail if csrfToken is invalid', async () => {
    // Given
    sessionGenericCsrfServiceMock.validate.mockImplementationOnce(() => {
      throw new Error();
    });

    // Then / When
    await expect(
      controller.updateUserPreferences(
        updatePreferencesBodyMock,
        sessionServiceMock,
      ),
    ).rejects.toThrow(SessionInvalidCsrfSelectIdpException);
  });
});
