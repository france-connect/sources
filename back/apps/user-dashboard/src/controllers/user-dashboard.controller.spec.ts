import { Request } from 'express';
import { v4 as uuid } from 'uuid';

import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationResult } from '@fc/common';
import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import {
  SessionCsrfService,
  SessionInvalidCsrfSelectIdpException,
} from '@fc/session';
import { TrackingService } from '@fc/tracking';
import { TrackDto, TracksService } from '@fc/tracks';
import {
  FormattedIdpDto,
  FormattedIdpSettingDto,
  UserPreferencesService,
} from '@fc/user-preferences';

import { GetUserTracesQueryDto } from '../dto';
import { UserInfosInterface } from '../interfaces';
import { UserDashboardService } from '../services';
import { UserDashboardController } from './user-dashboard.controller';

jest.mock('uuid');

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

  const uuidMockedValue = 'uuid-v4-Mocked-Value';

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
    sub: 'identityMock.sub value',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    idp_id: '8dfc4080-c90d-4234-969b-f6c961de3e90',
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

  const resMock = {
    status: jest.fn(),
    json: jest.fn(),
    send: jest.fn(),
  };

  const reqMock = {} as Request;

  const updatePreferencesBodyMock = {
    idpList: ['8dfc4080-c90d-4234-969b-f6c961de3e90'],
    csrfToken: 'csrfTokenMockValue',
    allowFutureIdp: false,
  };

  const userDashboardServiceMock = {
    sendMail: jest.fn(),
    formatUserPreferenceChangeTrackLog: jest.fn(),
  };

  const formatUserPreferenceChangeTrackLogReturnValue = {
    futureAllowedNewValue: false,
    list: [],
  };

  const trackingService = {
    track: jest.fn(),
    TrackedEventsMap: {
      UPDATED_USER_PREFERENCES: {},
      UPDATED_USER_PREFERENCES_FUTURE_IDP: {},
      UPDATED_USER_PREFERENCES_IDP: {},
    },
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
        TrackingService,
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
      .overrideProvider(TrackingService)
      .useValue(trackingService)
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

    resMock.json.mockImplementationOnce((arg) => arg);

    userDashboardServiceMock.formatUserPreferenceChangeTrackLog.mockReturnValueOnce(
      formatUserPreferenceChangeTrackLogReturnValue,
    );

    jest.mocked(uuid).mockReturnValueOnce(uuidMockedValue);
    jest.mocked(resMock.status).mockReturnValue(resMock);
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
      await controller.getUserTraces(
        reqMock,
        resMock,
        sessionServiceMock,
        queryMock,
      );
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should return a 401 if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      await controller.getUserTraces(
        reqMock,
        resMock,
        sessionServiceMock,
        queryMock,
      );
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith({ code: 'INVALID_SESSION' });
    });

    it('should call tracks.getList', async () => {
      // When
      await controller.getUserTraces(
        reqMock,
        resMock,
        sessionServiceMock,
        queryMock,
      );
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
        reqMock,
        resMock,
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
      await controller.getUserInfos(resMock, sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should return a 401 if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      await controller.getUserInfos(resMock, sessionServiceMock);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith({ code: 'INVALID_SESSION' });
    });

    it('should return an object with familyName, givenName and idp used for the connection props', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(identityMock);
      // When
      const { firstname, lastname, idpId } = (await controller.getUserInfos(
        resMock,
        sessionServiceMock,
      )) as UserInfosInterface;
      // Then
      expect(firstname).toStrictEqual(identityMock.given_name);
      expect(lastname).toStrictEqual(identityMock.family_name);
      expect(idpId).toStrictEqual('8dfc4080-c90d-4234-969b-f6c961de3e90');
    });
  });

  describe('getUserPreferences', () => {
    it('should fetch session', async () => {
      // When
      await controller.getUserPreferences(reqMock, resMock, sessionServiceMock);
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should return a 401 if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      await controller.getUserPreferences(reqMock, resMock, sessionServiceMock);
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith({ code: 'INVALID_SESSION' });
    });

    it('should call userPreferences.getUserPreferencesList', async () => {
      // Given
      const { idp_id: _idpId, ...identityWithoutIdpIdMock } = identityMock;

      // When
      await controller.getUserPreferences(reqMock, resMock, sessionServiceMock);
      // Then
      expect(userPreferencesMock.getUserPreferencesList).toHaveBeenCalledTimes(
        1,
      );
      expect(userPreferencesMock.getUserPreferencesList).toHaveBeenCalledWith(
        identityWithoutIdpIdMock,
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
      const result = await controller.getUserPreferences(
        reqMock,
        resMock,
        sessionServiceMock,
      );
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

    beforeEach(() => {
      controller['trackUserPreferenceChange'] = jest.fn();
    });

    it('should fetch session', async () => {
      // Given
      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );

      // When
      await controller.updateUserPreferences(
        reqMock,
        resMock,
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(sessionServiceMock.get).toHaveBeenCalledTimes(1);
      expect(sessionServiceMock.get).toHaveBeenCalledWith('idpIdentity');
    });

    it('should return a 401 if no session', async () => {
      // Given
      sessionServiceMock.get.mockResolvedValueOnce(undefined);
      // When
      await controller.updateUserPreferences(
        reqMock,
        resMock,
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(401);
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith({ code: 'INVALID_SESSION' });
    });

    it('should return a 409 if user tried to disable the idp currently used for the connection', async () => {
      // Given
      const preferencesBodyMock = {
        ...updatePreferencesBodyMock,
        idpList: ['dd61da8c-758a-4cc9-acb9-999d7c13df9a'],
      };

      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );

      // When
      await controller.updateUserPreferences(
        reqMock,
        resMock,
        preferencesBodyMock,
        sessionServiceMock,
      );

      // Then
      expect(resMock.status).toHaveBeenCalledTimes(1);
      expect(resMock.status).toHaveBeenCalledWith(409);
      expect(resMock.send).toHaveBeenCalledTimes(1);
      expect(resMock.send).toHaveBeenCalledWith({ code: 'CONFLICT' });
    });

    it('should call userPreferences.setUserPreferencesList', async () => {
      // Given
      const { idp_id: _idpId, ...identityWithoutIdpIdMock } = identityMock;
      const { allowFutureIdp, idpList } = updatePreferencesBodyMock;
      const expectedServicedArguments = { allowFutureIdp, idpList };

      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );

      // When
      await controller.updateUserPreferences(
        reqMock,
        resMock,
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(userPreferencesMock.setUserPreferencesList).toHaveBeenCalledTimes(
        1,
      );
      expect(userPreferencesMock.setUserPreferencesList).toHaveBeenCalledWith(
        identityWithoutIdpIdMock,
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
        reqMock,
        resMock,
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

    it('should call trackUserPreferenceChange', async () => {
      // Given

      userPreferencesMock.setUserPreferencesList.mockResolvedValueOnce(
        resolvedUserPreferencesMock,
      );

      // When
      await controller.updateUserPreferences(
        reqMock,
        resMock,
        updatePreferencesBodyMock,
        sessionServiceMock,
      );
      // Then
      expect(controller['trackUserPreferenceChange']).toHaveBeenCalledTimes(1);
      expect(controller['trackUserPreferenceChange']).toHaveBeenCalledWith(
        reqMock,
        resolvedUserPreferencesMock,
        identityMock,
      );
    });

    it('should fail if csrfToken is invalid', async () => {
      // Given
      sessionGenericCsrfServiceMock.validate.mockImplementationOnce(() => {
        throw new Error();
      });

      // Then / When
      await expect(
        controller.updateUserPreferences(
          reqMock,
          resMock,
          updatePreferencesBodyMock,
          sessionServiceMock,
        ),
      ).rejects.toThrow(SessionInvalidCsrfSelectIdpException);
    });
  });

  describe('trackUserPreferenceChange', () => {
    // Given
    const formattedIdpSettingsMock = {
      hasAllowFutureIdpChanged: true,
    } as unknown as FormattedIdpSettingDto;

    const formatUserPreferenceChangeTrackLogReturnValue = {
      list: [Symbol('idpChanges1'), Symbol('idpChanges2')],
      futureAllowedNewValue: false,
    };

    beforeEach(() => {
      userDashboardServiceMock.formatUserPreferenceChangeTrackLog
        .mockReset()
        .mockReturnValueOnce(formatUserPreferenceChangeTrackLogReturnValue);
    });

    it('should call userDashboard.formatUserPreferenceChangeTrackLog()', () => {
      // When
      controller['trackUserPreferenceChange'](
        reqMock,
        formattedIdpSettingsMock,
        identityMock,
      );
      // Then
      expect(
        controller['userDashboard'].formatUserPreferenceChangeTrackLog,
      ).toHaveBeenCalledTimes(1);
      expect(
        controller['userDashboard'].formatUserPreferenceChangeTrackLog,
      ).toHaveBeenCalledWith(formattedIdpSettingsMock);
    });

    it('should call tracking.track() for global event', () => {
      // When
      controller['trackUserPreferenceChange'](
        reqMock,
        formattedIdpSettingsMock,
        identityMock,
      );
      // Then
      expect(controller['tracking'].track).toHaveBeenCalledTimes(4);
      expect(controller['tracking'].track).toHaveBeenNthCalledWith(
        1,
        trackingService.TrackedEventsMap.UPDATED_USER_PREFERENCES,
        {
          req: reqMock,
          changeSetId: uuidMockedValue,
          idpLength: 2,
          hasAllowFutureIdpChanged: true,
          identity: identityMock,
        },
      );
    });

    it('should call tracking.track() for future idp change', () => {
      // When
      controller['trackUserPreferenceChange'](
        reqMock,
        formattedIdpSettingsMock,
        identityMock,
      );
      // Then
      expect(controller['tracking'].track).toHaveBeenNthCalledWith(
        2,
        trackingService.TrackedEventsMap.UPDATED_USER_PREFERENCES_FUTURE_IDP,
        {
          req: reqMock,
          changeSetId: uuidMockedValue,
          futureAllowedNewValue: false,
          identity: identityMock,
        },
      );
    });

    it('should call tracking.track() for each changed idp', () => {
      // When
      controller['trackUserPreferenceChange'](
        reqMock,
        formattedIdpSettingsMock,
        identityMock,
      );
      // Then
      expect(controller['tracking'].track).toHaveBeenNthCalledWith(
        3,
        trackingService.TrackedEventsMap.UPDATED_USER_PREFERENCES_IDP,
        {
          req: reqMock,
          changeSetId: uuidMockedValue,
          idpChanges: formatUserPreferenceChangeTrackLogReturnValue.list[0],
          identity: identityMock,
        },
      );
      expect(controller['tracking'].track).toHaveBeenNthCalledWith(
        4,
        trackingService.TrackedEventsMap.UPDATED_USER_PREFERENCES_IDP,
        {
          req: reqMock,
          changeSetId: uuidMockedValue,
          idpChanges: formatUserPreferenceChangeTrackLogReturnValue.list[1],
          identity: identityMock,
        },
      );
    });
  });
});
