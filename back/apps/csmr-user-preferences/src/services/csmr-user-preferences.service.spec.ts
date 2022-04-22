import { mocked } from 'jest-mock';

import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountNotFoundException, AccountService } from '@fc/account';
import { ConfigService } from '@fc/config';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger-legacy';
import {
  MailerNotificationConnectException,
  MailerService,
  MailFrom,
  NoEmailException,
} from '@fc/mailer';
import { IdentityProviderMetadata } from '@fc/oidc';

import { EmailsTemplates } from '../enums';
import { CsmrUserPreferencesIdpNotFoundException } from '../exceptions';
import { CsmrUserPreferencesService } from './csmr-user-preferences.service';
import {
  currentUserPreferences,
  expectedChangedUserPreferences,
  previousUserPreferences,
} from './fixtures/csmr-user-preferences.fixtures';

describe('CsmrUserPreferencesService', () => {
  let service: CsmrUserPreferencesService;
  let preferencesMock;

  const identityMock = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    given_name: 'Jean Paul Henri',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    family_name: 'Dupont',
    gender: 'male',
    birthdate: '1970-01-01',
    birthplace: '95277',
    birthcountry: '99100',
  } as IPivotIdentity;

  const identityHashMock = 'identityHashMockValue';
  const idpListMock = ['bar'];
  const idpListBeforeUpdate = ['foo'];
  const allowFutureIdpNewValue = false;
  const allowFutureIdpOldValue = true;
  const identityProviderMetadataMock = [
    {
      uid: 'foo',
      title: 'foo Title',
      name: 'Foo',
      image: 'foo.png',
      display: true,
      active: true,
      discovery: true,
      discoveryUrl:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
      issuer: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jwks_uri: 'https://fsp1v2.docker.dev-franceconnect.fr/jwks_uri',
      },
    },
    {
      uid: 'bar',
      title: 'bar Title',
      name: 'Bar',
      image: 'bar.png',
      display: true,
      active: true,
      discovery: true,
      discoveryUrl:
        'https://core-fcp-high.docker.dev-franceconnect.fr/api/v2/.well-known/openid-configuration',
      issuer: {
        // oidc param name
        // eslint-disable-next-line @typescript-eslint/naming-convention
        jwks_uri: 'https://fsp1v2.docker.dev-franceconnect.fr/jwks_uri',
      },
    },
  ] as IdentityProviderMetadata[];
  const accountMock = {
    id: '42',
    preferences: {
      idpSettings: {
        updatedAt: new Date(),
        list: idpListBeforeUpdate,
        isExcludeList: allowFutureIdpOldValue,
      },
    },
  } as Account;

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
  const createAccountPreferencesIdpSettingsResultMock = {
    isExcludeList: allowFutureIdpNewValue,
    list: idpListMock,
  };

  const formattedBeforeUpdatePreferencesIdpListMock = [
    {
      uid: 'foo',
      title: 'foo Title',
      name: 'Foo',
      image: 'foo.png',
      active: true,
      isChecked: false,
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

  const getFormattedUserIdpSettingsListsMock = {
    formattedIdpSettingsList: formattedUserIdpSettingsListMock,
    formattedPreviousIdpSettingsList:
      formattedBeforeUpdatePreferencesIdpListMock,
  };

  const htmlContent = 'myWonderful template content';
  const getIdpConfigUpdateEmailBodyContentMock = htmlContent;
  const accountBeforeUpdate = {
    ...accountMock,
    preferences: {
      idpSettings: {
        updatedAt: new Date(),
        list: idpListBeforeUpdate,
        isExcludeList: allowFutureIdpOldValue,
      },
    },
  } as Account;

  const IdpSettingsBeforeUpdateMock = {
    list: idpListBeforeUpdate,
    isExcludeList: true,
  };

  const userInfo = {
    email: 'user@test.com',
    givenName: 'firstname',
    familyName: 'lastname',
  };
  const idpConfiguration = {
    formattedIdpSettingsList: formattedUserIdpSettingsListMock,
    updatedIdpSettingsList: updatedIdpIdpSettingListMock,
    hasChangedIsExcludeList: true,
    allowFutureIdp: false,
  };

  const configMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const mailerServiceMock = {
    send: jest.fn(),
    mailToSend: jest.fn(),
  } as unknown as MailerService;

  const accountServiceMock = {
    getAccountByIdentityHash: jest.fn(),
    updatePreferences: jest.fn(),
  };

  const cryptographyFcpServiceMock = {
    computeIdentityHash: jest.fn(),
  };

  const identityProviderServiceMock = {
    getList: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsmrUserPreferencesService],
      providers: [
        LoggerService,
        AccountService,
        ConfigService,
        CryptographyFcpService,
        IdentityProviderAdapterMongoService,
        MailerService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .overrideProvider(MailerService)
      .useValue(mailerServiceMock)
      .compile();

    service = module.get<CsmrUserPreferencesService>(
      CsmrUserPreferencesService,
    );
  });

  describe('formatUserIdpSettingsList', () => {
    it('should return a formatted identity provider list with isCheck field', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        list: ['foo'],
      };
      const resolvedUserPreferencesMock = {
        idpList: [
          {
            uid: 'foo',
            title: 'foo Title',
            name: 'Foo',
            image: 'foo.png',
            active: true,
            isChecked: true,
          },
          {
            uid: 'bar',
            title: 'bar Title',
            name: 'Bar',
            image: 'bar.png',
            active: true,
            isChecked: false,
          },
        ],
        allowFutureIdp: false,
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toStrictEqual(resolvedUserPreferencesMock);
    });

    it('should filter idp we should not display', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        list: ['foo'],
      };
      const resolvedUserPreferencesMock = {
        idpList: [
          {
            active: true,
            image: 'bar.png',
            isChecked: false,
            name: 'Bar',
            title: 'bar Title',
            uid: 'bar',
          },
        ],
        allowFutureIdp: false,
      };
      const metadataMock = [
        {
          ...identityProviderMetadataMock[0],
          uid: 'foo',
          display: false,
        },
        identityProviderMetadataMock[1],
      ] as IdentityProviderMetadata[];

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        metadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toStrictEqual(resolvedUserPreferencesMock);
    });

    it('should return an identity provider list with isCheck set to true if identity provider list is empty', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        list: [],
      };
      const resolvedUserPreferencesMock = {
        idpList: [
          {
            uid: 'foo',
            title: 'foo Title',
            name: 'Foo',
            image: 'foo.png',
            active: true,
            isChecked: true,
          },
          {
            uid: 'bar',
            title: 'bar Title',
            name: 'Bar',
            image: 'bar.png',
            active: true,
            isChecked: true,
          },
        ],
        allowFutureIdp: false,
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toStrictEqual(resolvedUserPreferencesMock);
    });

    it('should return an identity provider list with isCheck set to true if preferences have not been set by user', () => {
      // Given
      preferencesMock = undefined;
      const resolvedUserPreferencesMock = {
        idpList: [
          {
            uid: 'foo',
            title: 'foo Title',
            name: 'Foo',
            image: 'foo.png',
            active: true,
            isChecked: true,
          },
          {
            uid: 'bar',
            title: 'bar Title',
            name: 'Bar',
            image: 'bar.png',
            active: true,
            isChecked: true,
          },
        ],
        allowFutureIdp: false,
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toStrictEqual(resolvedUserPreferencesMock);
    });

    it('should return an identity provider list for inclusive list', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        list: ['foo'],
      };
      const resolvedUserPreferencesMock = {
        idpList: [
          {
            uid: 'foo',
            title: 'foo Title',
            name: 'Foo',
            image: 'foo.png',
            active: true,
            isChecked: true,
          },
          {
            uid: 'bar',
            title: 'bar Title',
            name: 'Bar',
            image: 'bar.png',
            active: true,
            isChecked: false,
          },
        ],
        allowFutureIdp: false,
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toStrictEqual(resolvedUserPreferencesMock);
    });

    it('should return an identity provider list for exclusive list', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: true,
        list: ['foo'],
      };
      const resolvedUserPreferencesMock = {
        idpList: [
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
        ],
        allowFutureIdp: true,
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual(resolvedUserPreferencesMock);
    });
  });

  describe('updatedIdpSettings', () => {
    it('should return idp that have changed', () => {
      // GIVEN
      const current = [
        {
          uid: 'first_idp',
          isChecked: true,
        },
        {
          uid: 'second_idp',
          isChecked: true,
        },
      ];

      const previous = [
        {
          uid: 'first_idp',
          isChecked: false,
        },
        {
          uid: 'second_idp',
          isChecked: true,
        },
      ];

      const expected = [current[0]];

      // WHEN
      const result = service['updatedIdpSettings'](current, previous);

      // THEN
      expect(result).toEqual(expected);
    });

    it('should return multiple idp that have changed', () => {
      // GIVEN
      const current = currentUserPreferences;

      const previous = previousUserPreferences;

      const expected = expectedChangedUserPreferences;

      // WHEN
      const result = service['updatedIdpSettings'](current, previous);

      // THEN
      expect(result).toEqual(expected);
    });
  });

  describe('createAccountPreferencesIdpSettings', () => {
    it('should return an inclusive idp list if future idp are disabled', () => {
      // Given
      const idpUids = ['one', 'two', 'three', 'four'];
      const idpList = ['one', 'two'];

      // When
      const idpPreferences = service.createAccountPreferencesIdpSettings(
        idpList,
        false,
        idpUids,
      );

      // Then
      expect(idpPreferences).toEqual({
        isExcludeList: false,
        list: idpList,
      });
    });

    it('should return a list that exclude idp if future idp are enabled', () => {
      // Given
      const idpUids = ['one', 'two', 'three', 'four'];
      const idpList = ['one', 'two'];

      // When
      const idpPreferences = service.createAccountPreferencesIdpSettings(
        idpList,
        true,
        idpUids,
      );

      // Then
      expect(idpPreferences).toEqual({
        isExcludeList: true,
        list: ['three', 'four'],
      });
    });
  });

  describe('getIdpSettings()', () => {
    beforeEach(() => {
      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountMock,
      );
      identityProviderServiceMock.getList.mockResolvedValueOnce(
        identityProviderMetadataMock,
      );
      service.formatUserIdpSettingsList = jest
        .fn()
        .mockReturnValueOnce(formattedUserIdpSettingsListMock);
    });

    it('should return identity provider metadatas data', async () => {
      // When
      const idpSettings = await service.getIdpSettings(identityMock);

      // Then
      expect(idpSettings).toEqual(formattedUserIdpSettingsListMock);
    });

    it('should compute the identityHash from the identity', async () => {
      // Given / When
      await service.getIdpSettings(identityMock);
      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(identityMock);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
    });

    it('should get an Account object from an identityHash', async () => {
      // Given / When
      await service.getIdpSettings(identityMock);

      // Then
      expect(accountServiceMock.getAccountByIdentityHash).toHaveBeenCalledWith(
        identityHashMock,
      );
      expect(accountServiceMock.getAccountByIdentityHash).toHaveBeenCalledTimes(
        1,
      );
    });

    it('should throw an error `AccountNotFoundException` if no account found for an `identityHash`', async () => {
      // Given
      const accountEmptyMock = { id: null };
      const noAccountMock = new AccountNotFoundException();
      accountServiceMock.getAccountByIdentityHash
        .mockReset()
        .mockResolvedValueOnce(accountEmptyMock);

      // When / Then
      await expect(service.getIdpSettings(identityMock)).rejects.toThrow(
        noAccountMock,
      );
    });

    it('should get the list of identity provider metadata', async () => {
      // When
      await service.getIdpSettings(identityMock);

      // Then
      expect(identityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
    });

    it('should format metadata in order to clean data and add a "isCheck" property', async () => {
      // When
      await service.getIdpSettings(identityMock);

      // Then
      expect(service.formatUserIdpSettingsList).toHaveBeenCalledTimes(1);
      expect(service.formatUserIdpSettingsList).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        accountMock.preferences.idpSettings,
      );
    });
  });

  describe('setIdpSettings()', () => {
    const allowFutureIdp = false;
    beforeEach(() => {
      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.updatePreferences.mockResolvedValueOnce(
        accountBeforeUpdate,
      );
      identityProviderServiceMock.getList.mockResolvedValueOnce(
        identityProviderMetadataMock,
      );
      service['getFormattedUserIdpSettingsLists'] = jest
        .fn()
        .mockReturnValueOnce(getFormattedUserIdpSettingsListsMock);

      service.createAccountPreferencesIdpSettings = jest
        .fn()
        .mockReturnValueOnce(createAccountPreferencesIdpSettingsResultMock);

      service['updatedIdpSettings'] = jest
        .fn()
        .mockReturnValueOnce(updatedIdpIdpSettingListMock);

      service['getIdpConfigUpdateEmailBodyContent'] = jest
        .fn()
        .mockResolvedValueOnce(getIdpConfigUpdateEmailBodyContentMock);
    });

    it('Should get the metadata idp list', async () => {
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(identityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
      expect(identityProviderServiceMock.getList).toHaveBeenCalledWith();
    });

    it('should compute the identityHash from the identity', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);
      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(identityMock);
    });

    it('should throw CsmrUserPreferencesIdpNotFoundException if identity provider in parameter is not found in listing', async () => {
      // Given
      const idpList = ['idp_not_exists'];
      const idpNotFoundMock = new CsmrUserPreferencesIdpNotFoundException();

      // When
      await expect(
        service.setIdpSettings(identityMock, idpList, allowFutureIdp),
      ).rejects.toThrow(idpNotFoundMock);
    });

    it('should create the correct account preferences in order to use it in update method', async () => {
      // Given
      const idpUids = identityProviderMetadataMock.map((idp) => idp.uid);
      const inputIsExcludeList = false;
      // When
      await service.setIdpSettings(
        identityMock,
        idpListMock,
        inputIsExcludeList,
      );
      // Then
      expect(service.createAccountPreferencesIdpSettings).toHaveBeenCalledTimes(
        1,
      );
      expect(service.createAccountPreferencesIdpSettings).toBeCalledWith(
        idpListMock,
        inputIsExcludeList,
        idpUids,
      );
    });

    it('Should update the user account and get back the id and user preferences before update', async () => {
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(accountServiceMock.updatePreferences).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.updatePreferences).toBeCalledWith(
        identityHashMock,
        createAccountPreferencesIdpSettingsResultMock.list,
        createAccountPreferencesIdpSettingsResultMock.isExcludeList,
      );
    });

    it('should format metadata in order to clean data and add a "isCheck" property', async () => {
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(service['getFormattedUserIdpSettingsLists']).toHaveBeenCalledTimes(
        1,
      );
      expect(service['getFormattedUserIdpSettingsLists']).toHaveBeenCalledWith({
        idpList: identityProviderMetadataMock,
        newPreferences: createAccountPreferencesIdpSettingsResultMock,
        preferencesBeforeUpdate: IdpSettingsBeforeUpdateMock,
      });
    });

    it('should format metadata in order to clean data and add a "isCheck" property on first user update', async () => {
      // Given
      accountServiceMock.updatePreferences.mockReset();
      accountServiceMock.updatePreferences.mockResolvedValueOnce({});

      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(service['getFormattedUserIdpSettingsLists']).toHaveBeenCalledTimes(
        1,
      );
      expect(service['getFormattedUserIdpSettingsLists']).toHaveBeenCalledWith({
        idpList: identityProviderMetadataMock,
        newPreferences: createAccountPreferencesIdpSettingsResultMock,
        preferencesBeforeUpdate: {
          list: [],
          isExcludeList: false,
        },
      });
    });

    it('should call updatedIdpSettings', async () => {
      // WHEN
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // THEN
      expect(service['updatedIdpSettings']).toHaveBeenCalledTimes(1);
      expect(service['updatedIdpSettings']).toHaveBeenCalledWith(
        getFormattedUserIdpSettingsListsMock.formattedIdpSettingsList,
        getFormattedUserIdpSettingsListsMock.formattedPreviousIdpSettingsList,
      );
    });

    it('Should return identity provider metadata with updated data', async () => {
      // When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        idpListMock,
        allowFutureIdp,
      );

      // Then
      expect(updatedIdpSettings).toEqual({
        formattedIdpSettingsList: formattedUserIdpSettingsListMock,
        updatedIdpSettingsList: updatedIdpIdpSettingListMock,
        hasChangedIsExcludeList: true,
      });
    });

    it('Should return identity provider metadata with updated data on first user update', async () => {
      // Given
      accountServiceMock.updatePreferences.mockReset();
      accountServiceMock.updatePreferences.mockResolvedValueOnce({});

      // When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        idpListMock,
        allowFutureIdp,
      );

      // Then
      expect(updatedIdpSettings).toEqual({
        formattedIdpSettingsList: formattedUserIdpSettingsListMock,
        updatedIdpSettingsList: updatedIdpIdpSettingListMock,
        hasChangedIsExcludeList: false,
      });
    });
  });

  describe('sendMail', () => {
    const fromMock: MailFrom = { email: 'address@fqdn.ext', name: 'Address' };
    const configMailerMock = {
      template: getIdpConfigUpdateEmailBodyContentMock,
      from: fromMock,
    };

    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      service['configMailer'] = configMailerMock;
      service['getIdpConfigUpdateEmailBodyContent'] = jest
        .fn()
        .mockResolvedValueOnce(getIdpConfigUpdateEmailBodyContentMock);
    });

    it('should throw an `Error` if the FROM email is not valid', async () => {
      // Given
      const configMailerWithoutEmail: MailFrom = {
        email: 'fake_email',
        name: '',
      };
      service['configMailer'] = { from: configMailerWithoutEmail };
      const errorMock = new NoEmailException();

      // When/Then
      await expect(
        service.sendMail(userInfo, idpConfiguration),
      ).rejects.toThrow(errorMock);
    });

    it('should throw an Error if the TO email is not valid', async () => {
      // Given
      const badUserInfoData = {
        email: 'not_an_email',
        givenName: 'firstname',
        familyName: 'lastname',
      };

      // When/Then
      const errorMock = new NoEmailException();
      await expect(
        service.sendMail(badUserInfoData, idpConfiguration),
      ).rejects.toThrow(errorMock);
    });

    it('should call getIdpConfigUpdateEmailBodyContent', async () => {
      // WHEN
      await service.sendMail(userInfo, idpConfiguration);

      // THEN
      expect(
        service['getIdpConfigUpdateEmailBodyContent'],
      ).toHaveBeenCalledTimes(1);
      expect(
        service['getIdpConfigUpdateEmailBodyContent'],
      ).toHaveBeenCalledWith(userInfo, idpConfiguration);
    });

    it('should call getIdpConfigUpdateEmailBodyContent', async () => {
      // WHEN
      await service.sendMail(userInfo, idpConfiguration);

      // THEN
      expect(mailerServiceMock.send).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.send).toHaveBeenCalledWith({
        from: fromMock,
        to: [
          {
            email: userInfo.email,
            name: `${userInfo.givenName} ${userInfo.familyName}`,
          },
        ],
        subject: `Notification de mise à jour de votre configuration FI FC+`,
        body: getIdpConfigUpdateEmailBodyContentMock,
      });
    });
  });

  describe('getIdpConfigUpdateEmailBodyContent', () => {
    it('should throw if any parameters is not valid', async () => {
      // Given
      const badUserInfo = {
        email: 'bademail',
        givenName: 'firstName',
        FamilyName: 'lastname',
      };

      // When/Then
      const errorMock = new MailerNotificationConnectException();
      await expect(
        service['getIdpConfigUpdateEmailBodyContent'](
          badUserInfo,
          idpConfiguration,
        ),
      ).rejects.toThrow(errorMock);
    });

    it('should call mailToSend with futureIdpChoice =!idpConfiguration.allowFutureIdp', async () => {
      // WHEN
      await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        idpConfiguration,
      );

      // THEN
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledWith(
        EmailsTemplates.IDP_CONFIG_UPDATES_EMAIL,
        {
          ...userInfo,
          formattedIdpSettingsList: idpConfiguration.formattedIdpSettingsList,
          updatedIdpSettingsList: idpConfiguration.updatedIdpSettingsList,
          hasChangedIsExcludeList: idpConfiguration.hasChangedIsExcludeList,
          futureIdpChoice: !idpConfiguration.allowFutureIdp,
        },
      );
    });

    it('should call mailToSend with futureIdpChoice =idpConfiguration.allowFutureIdp', async () => {
      // GIVEN
      const otherIdpConfiguration = {
        formattedIdpSettingsList: formattedUserIdpSettingsListMock,
        updatedIdpSettingsList: updatedIdpIdpSettingListMock,
        hasChangedIsExcludeList: false,
        allowFutureIdp: false,
      };

      // WHEN
      await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        otherIdpConfiguration,
      );

      // THEN
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledTimes(1);
      expect(mailerServiceMock.mailToSend).toHaveBeenCalledWith(
        EmailsTemplates.IDP_CONFIG_UPDATES_EMAIL,
        {
          ...userInfo,
          formattedIdpSettingsList:
            otherIdpConfiguration.formattedIdpSettingsList,
          updatedIdpSettingsList: otherIdpConfiguration.updatedIdpSettingsList,
          hasChangedIsExcludeList:
            otherIdpConfiguration.hasChangedIsExcludeList,
          futureIdpChoice: otherIdpConfiguration.allowFutureIdp,
        },
      );
    });

    it('should return html content', async () => {
      // GIVEN
      mocked(mailerServiceMock.mailToSend).mockResolvedValueOnce(
        getIdpConfigUpdateEmailBodyContentMock,
      );

      // WHEN
      const result = await service['getIdpConfigUpdateEmailBodyContent'](
        userInfo,
        idpConfiguration,
      );

      // THEN
      expect(result).toEqual(getIdpConfigUpdateEmailBodyContentMock);
    });
  });

  describe('getFormattedUserIdpSettingsLists', () => {
    beforeEach(() => {
      service.formatUserIdpSettingsList = jest
        .fn()
        .mockReturnValueOnce({
          idpList: formattedUserIdpSettingsListMock,
          allowFutureIdp: false,
        })
        .mockReturnValueOnce({
          idpList: formattedBeforeUpdatePreferencesIdpListMock,
          allowFutureIdp: false,
        });
    });
    it('should call formatUserIdpSettingsList twice', () => {
      // WHEN
      const result = service['getFormattedUserIdpSettingsLists']({
        idpList: identityProviderMetadataMock,
        newPreferences: createAccountPreferencesIdpSettingsResultMock,
        preferencesBeforeUpdate: IdpSettingsBeforeUpdateMock,
      });

      // THEN
      expect(service.formatUserIdpSettingsList).toHaveBeenCalledTimes(2);
      expect(service.formatUserIdpSettingsList).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        createAccountPreferencesIdpSettingsResultMock,
      );
      expect(service.formatUserIdpSettingsList).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        IdpSettingsBeforeUpdateMock,
      );
      expect(result).toEqual({
        formattedIdpSettingsList: formattedUserIdpSettingsListMock,
        formattedPreviousIdpSettingsList:
          formattedBeforeUpdatePreferencesIdpListMock,
      });
    });
  });
});
