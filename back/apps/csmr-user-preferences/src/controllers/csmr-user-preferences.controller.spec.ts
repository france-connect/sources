import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { IPivotIdentity } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger';

import { SetIdpSettingsPayloadDto } from '../dto';
import { CsmrUserPreferencesService } from '../services';
import { CsmrUserPreferencesController } from './csmr-user-preferences.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('CsmrUserPreferencesController', () => {
  let csmrUserPreferencesController: CsmrUserPreferencesController;
  let validationDtoMock;

  const loggerMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    trace: jest.fn(),
  };

  const csmrUserPreferencesMock = {
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

  const idpListMock = ['foo'];
  const setIdpSettingsPayloadMock: SetIdpSettingsPayloadDto = {
    identity: identityMock,
    idpSettings: {
      idpList: idpListMock,
      allowFutureIdp: false,
    },
  };

  const formatUserIdpSettingsListResultMock = [
    {
      uid: 'foo',
      title: 'foo Title',
      name: 'Foo',
      image: 'foo.png',
      active: true,
      isChecked: false,
    },
    {
      uid: 'bar',
      title: 'bar Title',
      name: 'Bar',
      image: 'bar.png',
      active: true,
      isChecked: true,
    },
  ];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrUserPreferencesController],
      providers: [LoggerService, CsmrUserPreferencesService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrUserPreferencesService)
      .useValue(csmrUserPreferencesMock)
      .compile();

    csmrUserPreferencesController = app.get<CsmrUserPreferencesController>(
      CsmrUserPreferencesController,
    );
  });

  describe('getIdpSettings', () => {
    beforeEach(() => {
      validationDtoMock = mocked(validateDto);
    });

    it('should return result of csmrUserPreferencesService.getIdpSettings()', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      csmrUserPreferencesMock.getIdpSettings.mockResolvedValueOnce(
        formatUserIdpSettingsListResultMock,
      );
      // When
      const result = await csmrUserPreferencesController.getIdpSettings(
        getIdpSettingsPayloadMock,
      );
      // Then
      expect(result).toEqual(formatUserIdpSettingsListResultMock);
    });

    it('should return `ERROR` if error on csmrUserPreferencesService.getIdpSettings() occurs', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      csmrUserPreferencesMock.getIdpSettings.mockRejectedValueOnce(
        new Error('unknown error'),
      );
      // When
      const result = await csmrUserPreferencesController.getIdpSettings(
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

    it('should return result of csmrUserPreferencesService.setIdpSettings()', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      csmrUserPreferencesMock.setIdpSettings.mockResolvedValueOnce(
        formatUserIdpSettingsListResultMock,
      );
      // When
      const result = await csmrUserPreferencesController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );
      // Then
      expect(result).toBe(formatUserIdpSettingsListResultMock);
    });

    it('should return `ERROR` if error on csmrUserPreferencesService.setIdpSettings() occurs', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      csmrUserPreferencesMock.setIdpSettings.mockRejectedValueOnce(
        new Error('unknown error'),
      );
      // When
      const result = await csmrUserPreferencesController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );
      // Then
      expect(result).toBe('ERROR');
    });
  });
});
