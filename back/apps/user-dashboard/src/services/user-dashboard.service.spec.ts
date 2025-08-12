import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import {
  MailerHelper,
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  NoEmailException,
} from '@fc/mailer';
import { FormattedIdpSettingDto } from '@fc/user-preferences';

import { EmailsTemplates } from '../enums';
import { UserDashboardService } from './user-dashboard.service';

describe('UserDashboardService', () => {
  let service: UserDashboardService;

  const configMock = {
    get: jest.fn(),
  };

  const mailerServiceMock = {
    getPerson: jest.fn(),
    mailToSend: jest.fn(),
    send: jest.fn(),
  } as unknown as MailerService;

  const userInfo = {
    email: 'user@test.com',
    givenNameArray: ['givenname'],
    familyName: 'lastname',
    preferredUsername: 'preferredUsername',
  };

  const formattedUserIdpSettingsListMock = [
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

  const updatedIdpIdpSettingListMock = [
    {
      uid: 'bar',
      title: 'bar Title',
      name: 'Bar',
      image: 'bar.png',
      active: true,
      isChecked: true,
    },
  ];

  const idpConfiguration = {
    formattedIdpSettingsList: formattedUserIdpSettingsListMock,
    updatedIdpSettingsList: updatedIdpIdpSettingListMock,
    hasAllowFutureIdpChanged: true,
    allowFutureIdp: false,
    updatedAt: 1647772217000,
  };

  const formattedDateMock = '4 avril 2022 à 13:02:56';
  const htmlContent = 'myWonderful template content';
  const getIdpConfigUpdateEmailBodyContentMock = htmlContent;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService, MailerService, UserDashboardService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .compile();

    service = module.get<UserDashboardService>(UserDashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatDateForEmail', () => {
    it('should return the correct formatted date for a specific unix timestamp', () => {
      // Given
      const isoTimestamp = '2022-03-20T11:30:17.000Z';
      configMock.get.mockReturnValueOnce({ timezone: 'Europe/Paris' });
      // When
      const result = service['formatDateForEmail'](isoTimestamp);
      // Then
      expect(result).toBe('20 mars 2022 à 12:30:17');
    });
  });

  describe('getIdpConfigUpdateEmailBodyContent', () => {
    const personMock = 'person-mock';

    beforeEach(() => {
      service['formatDateForEmail'] = jest
        .fn()
        .mockReturnValue(formattedDateMock);
      jest.spyOn(MailerHelper, 'getPerson').mockReturnValueOnce(personMock);
    });

    it('should call MailerHelper.getPerson', async () => {
      // When
      await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        idpConfiguration,
      );

      // Then
      expect(MailerHelper.getPerson).toHaveBeenCalledExactlyOnceWith({
        givenNameArray: userInfo.givenNameArray,
        familyName: userInfo.familyName,
        preferredUsername: userInfo.preferredUsername,
      });
    });

    it('should throw MailerNotificationConnectException if any parameters is not valid', async () => {
      // Given
      const badUserInfo = {
        email: 'bademail',
        givenNameArray: ['givenname'],
        familyName: 'lastname',
        preferredUsername: 'preferredUsername',
      };
      const errorMock = new MailerNotificationConnectException();

      // When / Then
      await expect(
        service['getIdpConfigUpdateEmailBodyContent'](
          badUserInfo,
          idpConfiguration,
        ),
      ).rejects.toThrow(errorMock);
    });

    it('should call mailToSend with futureIdpChoice =!idpConfiguration.allowFutureIdp', async () => {
      // When
      await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        idpConfiguration,
      );

      // Then
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledWith(
        EmailsTemplates.IDP_CONFIG_UPDATES_EMAIL,
        {
          email: userInfo.email,
          person: personMock,
          formattedUpdateDate: formattedDateMock,
          updatedIdpSettingsList: idpConfiguration.updatedIdpSettingsList,
          hasAllowFutureIdpChanged: idpConfiguration.hasAllowFutureIdpChanged,
          allowFutureIdp: idpConfiguration.allowFutureIdp,
        },
      );
    });

    it('should call mailToSend with futureIdpChoice =idpConfiguration.allowFutureIdp', async () => {
      // Given
      const otherIdpConfiguration = {
        formattedIdpSettingsList: formattedUserIdpSettingsListMock,
        updatedIdpSettingsList: updatedIdpIdpSettingListMock,
        hasAllowFutureIdpChanged: false,
        allowFutureIdp: false,
      };

      // When
      await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        otherIdpConfiguration,
      );

      // Then
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledWith(
        EmailsTemplates.IDP_CONFIG_UPDATES_EMAIL,
        {
          email: userInfo.email,
          person: personMock,
          updatedIdpSettingsList: otherIdpConfiguration.updatedIdpSettingsList,
          hasAllowFutureIdpChanged:
            otherIdpConfiguration.hasAllowFutureIdpChanged,
          allowFutureIdp: otherIdpConfiguration.allowFutureIdp,
          formattedUpdateDate: formattedDateMock,
        },
      );
    });

    it('should return html content', async () => {
      // Given
      jest
        .mocked(mailerServiceMock.mailToSend)
        .mockResolvedValueOnce(getIdpConfigUpdateEmailBodyContentMock);

      // When
      const result = await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        idpConfiguration,
      );

      // Then
      expect(result).toEqual(getIdpConfigUpdateEmailBodyContentMock);
    });
  });

  describe('sendMail', () => {
    const fromMock: MailFrom = { email: 'address@fqdn.ext', name: 'Address' };
    const personMock = 'person-mock';

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      service['getIdpConfigUpdateEmailBodyContent'] = jest
        .fn()
        .mockResolvedValueOnce(getIdpConfigUpdateEmailBodyContentMock);

      jest.spyOn(MailerHelper, 'getPerson').mockReturnValueOnce(personMock);
    });

    it('should throw NoEmailException if the FROM email is not valid', async () => {
      // Given
      const configMailerWithoutEmail = {
        email: 'fake_email',
      };
      configMock.get.mockReturnValueOnce({ from: configMailerWithoutEmail });
      const errorMock = new NoEmailException();

      // When / Then
      await expect(
        service.sendMail(userInfo, idpConfiguration),
      ).rejects.toThrow(errorMock);
    });

    it('should call MailerHelper.getPerson', async () => {
      // Given
      configMock.get.mockReturnValueOnce({ from: fromMock });

      // When
      await service.sendMail(userInfo, idpConfiguration);

      // Then
      expect(MailerHelper.getPerson).toHaveBeenCalledExactlyOnceWith({
        givenNameArray: userInfo.givenNameArray,
        familyName: userInfo.familyName,
        preferredUsername: userInfo.preferredUsername,
      });
    });

    it('should throw NoEmailException if the TO email is not valid', async () => {
      // Given
      const badUserInfoData = {
        email: 'not_an_email',
        givenNameArray: ['givenname'],
        familyName: 'lastname',
      };
      configMock.get.mockReturnValueOnce({ from: fromMock });
      const errorMock = new NoEmailException();

      // When / Then
      await expect(
        service.sendMail(badUserInfoData, idpConfiguration),
      ).rejects.toThrow(errorMock);
    });

    it('should call getIdpConfigUpdateEmailBodyContent', async () => {
      // Given
      configMock.get.mockReturnValueOnce({ from: fromMock });

      // When
      await service.sendMail(userInfo, idpConfiguration);

      // Then
      expect(
        service['getIdpConfigUpdateEmailBodyContent'],
      ).toHaveBeenCalledTimes(1);
      expect(
        service['getIdpConfigUpdateEmailBodyContent'],
      ).toHaveBeenCalledWith(userInfo, idpConfiguration);
    });

    it('should call getIdpConfigUpdateEmailBodyContent', async () => {
      // Given
      configMock.get.mockReturnValueOnce({ from: fromMock });

      // When
      await service.sendMail(userInfo, idpConfiguration);

      // Then
      expect(mailerServiceMock.send).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.send).toHaveBeenCalledWith({
        from: fromMock,
        to: [
          {
            email: userInfo.email,
            name: personMock,
          },
        ],
        subject: `Modification de vos accès dans FranceConnect`,
        body: getIdpConfigUpdateEmailBodyContentMock,
      });
    });
  });

  describe('formatUserPreferenceChangeTrackLog', () => {
    // Given
    const baseFormattedIdpSettings = {
      allowFutureIdp: true,
      idpList: [],
      updatedIdpSettingsList: [],
      hasAllowFutureIdpChanged: false,
      updatedAt: 'updatedAtValue',
    } as unknown as FormattedIdpSettingDto;
    it('should return changeset with allowFutureIdp setting', () => {
      // Given
      const input = {
        ...baseFormattedIdpSettings,
        hasAllowFutureIdpChanged: true,
      };
      // When
      const result = service.formatUserPreferenceChangeTrackLog(input);
      // Then
      expect(result).toEqual(
        expect.objectContaining({
          futureAllowedNewValue: true,
        }),
      );
    });

    it('should return changeset without allowFutureIdp setting', () => {
      // Given
      const input = baseFormattedIdpSettings;
      // When
      const result = service.formatUserPreferenceChangeTrackLog(input);
      // Then
      expect(result).toEqual(
        expect.not.objectContaining({
          futureAllowedNewValue: true,
        }),
      );
    });

    it('should return changeset with formatted content', () => {
      // Given
      const input = {
        ...baseFormattedIdpSettings,
        updatedIdpSettingsList: [
          {
            uid: 'uid',
            name: 'name',
            title: 'title',
            allowed: true,
            image: 'image',
            active: true,
            isChecked: true,
          },
        ],
      };

      // When
      const result = service.formatUserPreferenceChangeTrackLog(input);
      // Then
      expect(result).toEqual({
        list: [
          {
            uid: 'uid',
            name: 'name',
            title: 'title',
            allowed: true,
          },
        ],
      });
    });
  });
});
