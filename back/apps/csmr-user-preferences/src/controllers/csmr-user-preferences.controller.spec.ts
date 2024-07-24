import { Test, TestingModule } from '@nestjs/testing';

import { validateDto } from '@fc/common';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import { SetIdpSettingsPayloadDto } from '../dto';
import { IPivotIdentity } from '../interfaces';
import { CsmrUserPreferencesService } from '../services';
import { CsmrUserPreferencesController } from './csmr-user-preferences.controller';

jest.mock('@fc/common', () => ({
  ...(jest.requireActual('@fc/common') as any),
  validateDto: jest.fn(),
}));

describe('CsmrUserPreferencesController', () => {
  let csmrUserPreferencesController: CsmrUserPreferencesController;
  let validationDtoMock;

  const loggerMock = getLoggerMock();

  const csmrUserPreferencesServiceMock = {
    getIdpSettings: jest.fn(),
    setIdpSettings: jest.fn(),
  };

  const identityMock: IPivotIdentity = {
    sub: '',
    given_name: 'Angela Claire Louise',
    family_name: 'DUBOIS',
    birthdate: '1962-08-24',
    gender: 'female',
    preferred_username: '',
    birthcountry: '99100',
    birthplace: '75107',
    email: 'wossewodda-3728@yopmail.com',
  };

  const getIdpSettingsPayloadMock = {
    identity: identityMock,
  };

  const idpListMock = ['foo', 'bar'];
  const setIdpSettingsPayloadMock: SetIdpSettingsPayloadDto = {
    identity: identityMock,
    idpSettings: {
      idpList: idpListMock,
      allowFutureIdp: false,
    },
  };

  const formatIdpSettingsResultMock = [
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
      .useValue(csmrUserPreferencesServiceMock)
      .compile();

    csmrUserPreferencesController = app.get<CsmrUserPreferencesController>(
      CsmrUserPreferencesController,
    );
  });

  describe('getIdpSettings', () => {
    beforeEach(() => {
      validationDtoMock = jest.mocked(validateDto);
    });

    it('should return result of csmrUserPreferencesService.getIdpSettings()', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      csmrUserPreferencesServiceMock.getIdpSettings.mockResolvedValueOnce(
        formatIdpSettingsResultMock,
      );
      // When
      const result = await csmrUserPreferencesController.getIdpSettings(
        getIdpSettingsPayloadMock,
      );
      // Then
      expect(result).toEqual(formatIdpSettingsResultMock);
    });

    it('should log error if error on csmrUserPreferencesService.getIdpSettings() occurs', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      const errorMock = new Error('unknown error');
      csmrUserPreferencesServiceMock.getIdpSettings.mockRejectedValueOnce(
        errorMock,
      );
      // When
      await csmrUserPreferencesController.getIdpSettings(
        getIdpSettingsPayloadMock,
      );
      // Then
      expect(loggerMock.err).toHaveBeenCalledTimes(1);
      expect(loggerMock.err).toHaveBeenCalledWith(errorMock);
    });

    it('should return `ERROR` if error on csmrUserPreferencesService.getIdpSettings() occurs', async () => {
      // Given
      validationDtoMock.mockResolvedValueOnce([]);
      csmrUserPreferencesServiceMock.getIdpSettings.mockRejectedValueOnce(
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
    const updatedIdpSettingsFormattedMock = [
      {
        uid: 'bar',
        title: 'bar Title',
        name: 'Bar',
        image: 'bar.png',
        active: true,
        isChecked: false,
      },
    ];
    const hasAllowFutureIdpChangedMock = true;
    const updatedAtMock = expect.any(Date);
    const expectedResultCsmrUserPreferencesServiceMockSetIdpSettings = {
      formattedIdpSettingsList: formatIdpSettingsResultMock,
      updatedIdpSettingsList: updatedIdpSettingsFormattedMock,
      hasAllowFutureIdpChanged: hasAllowFutureIdpChangedMock,
      updatedAt: updatedAtMock,
    };

    beforeEach(() => {
      validationDtoMock = jest.mocked(validateDto);
    });

    it('should call setIdpSettings from userPreferencesCsmr service', async () => {
      // GIVEN
      csmrUserPreferencesServiceMock.setIdpSettings.mockResolvedValueOnce(
        expectedResultCsmrUserPreferencesServiceMockSetIdpSettings,
      );

      // WHEN
      await csmrUserPreferencesController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );

      // THEN
      expect(
        csmrUserPreferencesServiceMock.setIdpSettings,
      ).toHaveBeenCalledTimes(1);
      expect(
        csmrUserPreferencesServiceMock.setIdpSettings,
      ).toHaveBeenCalledWith(
        setIdpSettingsPayloadMock.identity,
        setIdpSettingsPayloadMock.idpSettings.idpList,
        setIdpSettingsPayloadMock.idpSettings.allowFutureIdp,
      );
    });

    it('should return a list of idp with their settings and choice concerning future idps', async () => {
      // GIVEN
      csmrUserPreferencesServiceMock.setIdpSettings.mockResolvedValueOnce(
        expectedResultCsmrUserPreferencesServiceMockSetIdpSettings,
      );
      const expectedResult = {
        allowFutureIdp: setIdpSettingsPayloadMock.idpSettings.allowFutureIdp,
        idpList:
          expectedResultCsmrUserPreferencesServiceMockSetIdpSettings.formattedIdpSettingsList,
        updatedIdpSettingsList: updatedIdpSettingsFormattedMock,
        hasAllowFutureIdpChanged: true,
        updatedAt: expect.any(Date),
      };

      // When
      const result = await csmrUserPreferencesController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );
      // Then
      expect(result).toStrictEqual(expectedResult);
    });

    it('should log error if error on csmrUserPreferencesService.setIdpSettings() occurs', async () => {
      // Given
      const errorMock = new Error('unknown error');
      csmrUserPreferencesServiceMock.setIdpSettings.mockRejectedValueOnce(
        errorMock,
      );
      // When
      await csmrUserPreferencesController.setIdpSettings(
        setIdpSettingsPayloadMock,
      );
      // Then
      expect(loggerMock.err).toHaveBeenCalledTimes(1);
      expect(loggerMock.err).toHaveBeenCalledWith(errorMock);
    });

    it('should return `ERROR` if an error on csmrUserPreferencesService.setIdpSettings() occurs', async () => {
      // Given
      csmrUserPreferencesServiceMock.setIdpSettings.mockRejectedValueOnce(
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
