import { mocked } from 'ts-jest/utils';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { IPivotIdentity } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger';

import { SetIdpSettingsPayloadDto } from '../dto';
import { UserPreferencesFcpService } from '../services';
import { UserPreferencesFcpController } from './user-preferences-fcp.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('UserPreferencesFcpController', () => {
  let userPreferencesFcpController: UserPreferencesFcpController;
  let validationDtoMock;

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    trace: jest.fn(),
  };

  const userPreferencesFcpMock = {
    getIdpSettings: jest.fn(),
    setIdpSettings: jest.fn(),
  };

  const identityMock: IPivotIdentity = {
    sub: '',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Angela Claire Louise',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'DUBOIS',
    birthdate: '1962-08-24',
    gender: 'female',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    preferred_username: '',
    birthcountry: '99100',
    birthplace: '75107',
    email: 'wossewodda-3728@yopmail.com',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    phone_number: '123456789',
  };

  const getIdpSettingsPayloadMock = {
    identity: identityMock,
  };

  const includeListMock = ['idp_uid_1', 'idp_uid_2'];
  const setIdpSettingsPayloadMock: SetIdpSettingsPayloadDto = {
    identity: identityMock,
    idpSettings: {
      includeList: includeListMock,
    },
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesFcpController],
      providers: [LoggerService, UserPreferencesFcpService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(UserPreferencesFcpService)
      .useValue(userPreferencesFcpMock)
      .compile();

    userPreferencesFcpController = app.get<UserPreferencesFcpController>(
      UserPreferencesFcpController,
    );
  });

  describe('getIdpSettings', () => {
    beforeEach(() => {
      validationDtoMock = mocked(validateDto);
    });

    it('should return result of userPreferencesFcpService.getIdpSettings()', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      const expectedValue = { updatedAt: new Date(), includeList: ['foo'] };
      userPreferencesFcpMock.getIdpSettings.mockResolvedValueOnce(
        expectedValue,
      );

      // When
      const result = await userPreferencesFcpController.getIdpSettings(
        getIdpSettingsPayloadMock,
      );

      // Then
      expect(result).toEqual(expectedValue);
    });

    it('should return `ERROR` if error on userPreferencesFcpService.getIdpSettings() occurs', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      userPreferencesFcpMock.getIdpSettings.mockRejectedValueOnce(
        new Error('unknown error'),
      );

      // When
      const result = await userPreferencesFcpController.getIdpSettings(
        getIdpSettingsPayloadMock,
      );

      // Then
      expect(result).toBe('ERROR');
    });
  });

  describe('setIdpSettings', () => {
    beforeEach(() => {
      validationDtoMock = mocked(validateDto);
    });

    it('should return result of userPreferencesFcpService.getIdpSettings()', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      const expectedValue = {
        updatedAt: new Date(),
        includeList: setIdpSettingsPayloadMock.idpSettings.includeList,
      };
      userPreferencesFcpMock.setIdpSettings.mockResolvedValueOnce(
        expectedValue,
      );

      // When
      const result = await userPreferencesFcpController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );

      // Then
      expect(result).toBe(expectedValue);
    });

    it('should return `ERROR` if error on userPreferencesFcpService.getIdpSettings() occurs', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      userPreferencesFcpMock.setIdpSettings.mockRejectedValueOnce(
        new Error('unknown error'),
      );

      // When
      const result = await userPreferencesFcpController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );

      // Then
      expect(result).toBe('ERROR');
    });
  });
});
