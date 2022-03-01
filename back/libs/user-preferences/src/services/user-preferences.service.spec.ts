import { mocked } from 'jest-mock';
import { lastValueFrom } from 'rxjs';

import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { UserPreferencesProtocol } from '@fc/microservices';
import { IOidcIdentity } from '@fc/oidc';

import { IdpSettingsDto } from '../dto';
import {
  GetUserPreferencesConsumerErrorException,
  GetUserPreferencesResponseException,
  SetUserPreferencesConsumerErrorException,
  SetUserPreferencesResponseException,
} from '../exceptions';
import { UserPreferencesService } from './user-preferences.service';

jest.mock('rxjs');

describe('UserPreferencesService', () => {
  let service: UserPreferencesService;

  const lastValueFromMock = mocked(lastValueFrom);

  const loggerServiceMock = {
    debug: jest.fn(),
    setContext: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const identityMock = {} as IOidcIdentity;

  const configMock = {
    get: jest.fn(),
  };

  const brokerMock = {
    close: jest.fn(),
    connect: jest.fn(),
    send: jest.fn(),
  };

  const messageMock = {
    pipe: jest.fn(),
  };

  const pipeMock = {};
  const brokerResponseMock = 'brokerResponseMock';

  const idpSettingsMock: IdpSettingsDto = {
    idpList: ['foo', 'bar'],
    allowFutureIdp: false,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserPreferencesService,
        LoggerService,
        ConfigService,
        {
          provide: 'UserPreferencesBroker',
          useValue: brokerMock,
        },
      ],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .compile();

    service = module.get<UserPreferencesService>(UserPreferencesService);

    configMock.get.mockReturnValueOnce({
      payloadEncoding: 'base64',
      requestTimeout: 200,
    });

    brokerMock.send.mockReturnValue(messageMock);
    messageMock.pipe.mockReturnValue(pipeMock);
    lastValueFromMock.mockResolvedValue(brokerResponseMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUserPreferencesList', () => {
    it('should return a promise', async () => {
      // When
      const result = service.getUserPreferencesList(identityMock);
      // Then
      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('should call config.get', async () => {
      // When
      await service.getUserPreferencesList(identityMock);
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('UserPreferencesBroker');
    });

    it('should call broker.send with the user identity', async () => {
      // When
      await service.getUserPreferencesList(identityMock);
      // Then
      expect(brokerMock.send).toHaveBeenCalledTimes(1);
      expect(brokerMock.send).toHaveBeenCalledWith(
        UserPreferencesProtocol.Commands.GET_IDP_SETTINGS,
        {
          identity: identityMock,
        },
      );
    });

    it('should reject when the rabbitmq response has failed', async () => {
      // Given
      const rejectedValueMock = 'rejectedValueMock';
      lastValueFromMock.mockRejectedValueOnce(rejectedValueMock);
      // When / Then
      await expect(
        service.getUserPreferencesList(identityMock),
      ).rejects.toThrow(GetUserPreferencesResponseException);
    });

    it('should reject if consumer returns an error', async () => {
      // Given
      const rejectedValueMock = 'ERROR';
      lastValueFromMock.mockResolvedValueOnce(rejectedValueMock);
      // When / Then
      await expect(
        service.getUserPreferencesList(identityMock),
      ).rejects.toThrow(GetUserPreferencesConsumerErrorException);
    });

    it('should resolve when the rabbitmq response is successful', async () => {
      // Given
      const resolvedValueMock = 'resolvedValueMock';
      lastValueFromMock.mockResolvedValueOnce(resolvedValueMock);
      // When
      const result = await service.getUserPreferencesList(identityMock);
      // Then
      expect(result).toEqual(resolvedValueMock);
    });
  });

  describe('setUserPreferencesList', () => {
    it('should return a promise', async () => {
      // When
      const result = service.setUserPreferencesList(
        identityMock,
        idpSettingsMock,
      );
      // Then
      expect(result).toBeInstanceOf(Promise);
      await result;
    });

    it('should call config.get', async () => {
      // When
      await service.setUserPreferencesList(identityMock, idpSettingsMock);
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('UserPreferencesBroker');
    });

    it('should call broker.send with the user identity and idpSettings', async () => {
      // When
      await service.setUserPreferencesList(identityMock, idpSettingsMock);
      // Then
      expect(brokerMock.send).toHaveBeenCalledTimes(1);
      expect(brokerMock.send).toHaveBeenCalledWith(
        UserPreferencesProtocol.Commands.SET_IDP_SETTINGS,
        {
          identity: identityMock,
          idpSettings: idpSettingsMock,
        },
      );
    });

    it('should reject when the rabbitmq response has failed', async () => {
      // Given
      const rejectedValueMock = 'rejectedValueMock';
      lastValueFromMock.mockRejectedValueOnce(rejectedValueMock);
      // When / Then
      await expect(
        service.setUserPreferencesList(identityMock, idpSettingsMock),
      ).rejects.toThrow(SetUserPreferencesResponseException);
    });

    it('should reject if consumer returns an error', async () => {
      // Given
      const rejectedValueMock = 'ERROR';
      lastValueFromMock.mockResolvedValueOnce(rejectedValueMock);
      // When / Then
      await expect(
        service.setUserPreferencesList(identityMock, idpSettingsMock),
      ).rejects.toThrow(SetUserPreferencesConsumerErrorException);
    });

    it('should resolve when the rabbitmq response is successful', async () => {
      // Given
      const resolvedValueMock = 'resolvedValueMock';
      lastValueFromMock.mockResolvedValueOnce(resolvedValueMock);
      // When
      const result = await service.setUserPreferencesList(
        identityMock,
        idpSettingsMock,
      );
      // Then
      expect(result).toEqual(resolvedValueMock);
    });
  });
});
