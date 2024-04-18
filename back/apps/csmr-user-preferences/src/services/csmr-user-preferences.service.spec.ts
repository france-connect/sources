import { Test, TestingModule } from '@nestjs/testing';

import {
  Account,
  AccountNotFoundException,
  AccountService,
  IIdpSettings,
} from '@fc/account';
import { ConfigService } from '@fc/config';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';

import { getLoggerMock } from '@mocks/logger';

import { CsmrUserPreferencesIdpNotFoundException } from '../exceptions';
import { IFormattedIdpList } from '../interfaces';
import { CsmrUserPreferencesService } from './csmr-user-preferences.service';
import {
  currentUserPreferences,
  expectedChangedUserPreferences,
  previousUserPreferences,
} from './fixtures/csmr-user-preferences.fixtures';

describe('CsmrUserPreferencesService', () => {
  let service: CsmrUserPreferencesService;
  let preferencesMock: IIdpSettings;

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
  const accountWithoutPreferencesMock = {
    id: '43',
  } as Account;

  const formattedIdpSettingsListMock: IFormattedIdpList[] = [
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
  const createIdpSettingsResultMock: Pick<
    IIdpSettings,
    'isExcludeList' | 'list'
  > = {
    isExcludeList: allowFutureIdpNewValue,
    list: idpListMock,
  };

  const formattedPreviousIdpSettingsListMock: IFormattedIdpList[] = [
    {
      uid: 'foo',
      title: 'foo Title',
      name: 'Foo',
      image: 'foo.png',
      active: true,
      isChecked: false,
    },
  ];

  const updatedIdpIdpSettingListMock: IFormattedIdpList[] = [
    {
      uid: 'bar',
      title: 'bar Title',
      name: 'Bar',
      image: 'bar.png',
      active: true,
      isChecked: true,
    },
  ];

  const getFormattedIdpSettingsListsMock = {
    formattedIdpSettingsList: formattedIdpSettingsListMock,
    formattedPreviousIdpSettingsList: formattedPreviousIdpSettingsListMock,
  };

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

  const configMock = {
    get: jest.fn(),
  };

  const loggerServiceMock = getLoggerMock();

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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsmrUserPreferencesService],
      providers: [
        LoggerService,
        AccountService,
        ConfigService,
        CryptographyFcpService,
        IdentityProviderAdapterMongoService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpServiceMock)
      .overrideProvider(IdentityProviderAdapterMongoService)
      .useValue(identityProviderServiceMock)
      .compile();

    service = module.get<CsmrUserPreferencesService>(
      CsmrUserPreferencesService,
    );
  });

  describe('formatIdpSettings', () => {
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
      const idpSettingsList = service['formatIdpSettings'](
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
      const idpSettingsList = service['formatIdpSettings'](
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
      const idpSettingsList = service['formatIdpSettings'](
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
      const idpSettingsList = service['formatIdpSettings'](
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
      const idpSettingsList = service['formatIdpSettings'](
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
      ] as IFormattedIdpList[];

      const previous = [
        {
          uid: 'first_idp',
          isChecked: false,
        },
        {
          uid: 'second_idp',
          isChecked: true,
        },
      ] as IFormattedIdpList[];

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

  describe('createIdpSettings', () => {
    it('should return an inclusive idp list if future idp are disabled', () => {
      // Given
      const idpUids = ['one', 'two', 'three', 'four'];
      const idpList = ['one', 'two'];

      // When
      const idpPreferences = service['createIdpSettings'](
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
      const idpPreferences = service['createIdpSettings'](
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
      service['getIdentityProviderList'] = jest
        .fn()
        .mockResolvedValueOnce(identityProviderMetadataMock);
      service['formatIdpSettings'] = jest
        .fn()
        .mockReturnValueOnce(formattedIdpSettingsListMock);
    });

    it('should return identity provider metadatas data', async () => {
      // When
      const idpSettings = await service.getIdpSettings(identityMock);

      // Then
      expect(idpSettings).toEqual(formattedIdpSettingsListMock);
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
      expect(service['getIdentityProviderList']).toHaveBeenCalledTimes(1);
      expect(service['getIdentityProviderList']).toHaveBeenCalledWith();
    });

    it('should call formatIdpSettings with default idpSettings values if the user has no preferences', async () => {
      // Given
      accountServiceMock.getAccountByIdentityHash.mockReset();
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountWithoutPreferencesMock,
      );

      // When
      await service.getIdpSettings(identityMock);

      // Then
      expect(service['formatIdpSettings']).toHaveBeenCalledTimes(1);
      expect(service['formatIdpSettings']).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        { isExcludeList: true, list: [] },
      );
    });

    it('should format metadata in order to clean data and add a "isCheck" property', async () => {
      // When
      await service.getIdpSettings(identityMock);

      // Then
      expect(service['formatIdpSettings']).toHaveBeenCalledTimes(1);
      expect(service['formatIdpSettings']).toHaveBeenCalledWith(
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
      service['getIdentityProviderList'] = jest
        .fn()
        .mockResolvedValueOnce(identityProviderMetadataMock);
      service['getFormattedIdpSettingsLists'] = jest
        .fn()
        .mockReturnValueOnce(getFormattedIdpSettingsListsMock);

      service['createIdpSettings'] = jest
        .fn()
        .mockReturnValueOnce(createIdpSettingsResultMock);

      service['updatedIdpSettings'] = jest
        .fn()
        .mockReturnValueOnce(updatedIdpIdpSettingListMock);
    });

    it('should get the metadata idp list', async () => {
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(service['getIdentityProviderList']).toHaveBeenCalledTimes(1);
      expect(service['getIdentityProviderList']).toHaveBeenCalledWith();
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
      expect(service['createIdpSettings']).toHaveBeenCalledTimes(1);
      expect(service['createIdpSettings']).toBeCalledWith(
        idpListMock,
        inputIsExcludeList,
        idpUids,
      );
    });

    it('should update the user account and get back the id and user preferences before update', async () => {
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(accountServiceMock.updatePreferences).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.updatePreferences).toBeCalledWith(
        identityHashMock,
        createIdpSettingsResultMock.list,
        createIdpSettingsResultMock.isExcludeList,
      );
    });

    it('should format the current and previous idpSettings lists', async () => {
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(service['getFormattedIdpSettingsLists']).toHaveBeenCalledTimes(1);
      expect(service['getFormattedIdpSettingsLists']).toHaveBeenCalledWith({
        idpList: identityProviderMetadataMock,
        currentSettings: createIdpSettingsResultMock,
        previousSettings: accountBeforeUpdate.preferences.idpSettings,
      });
    });

    it('should format the current and previous idpSettings lists on first user update', async () => {
      // Given
      accountServiceMock.updatePreferences.mockReset();
      accountServiceMock.updatePreferences.mockResolvedValueOnce({});

      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // Then
      expect(service['getFormattedIdpSettingsLists']).toHaveBeenCalledTimes(1);
      expect(service['getFormattedIdpSettingsLists']).toHaveBeenCalledWith({
        idpList: identityProviderMetadataMock,
        currentSettings: createIdpSettingsResultMock,
        previousSettings: {
          list: [],
          isExcludeList: true,
        },
      });
    });

    it('should call updatedIdpSettings', async () => {
      // WHEN
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);

      // THEN
      expect(service['updatedIdpSettings']).toHaveBeenCalledTimes(1);
      expect(service['updatedIdpSettings']).toHaveBeenCalledWith(
        getFormattedIdpSettingsListsMock.formattedIdpSettingsList,
        getFormattedIdpSettingsListsMock.formattedPreviousIdpSettingsList,
      );
    });

    it('should return identity provider metadata with updated data', async () => {
      // When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        idpListMock,
        allowFutureIdp,
      );

      // Then
      expect(updatedIdpSettings).toEqual({
        formattedIdpSettingsList: formattedIdpSettingsListMock,
        updatedIdpSettingsList: updatedIdpIdpSettingListMock,
        hasAllowFutureIdpChanged: true,
      });
    });

    it('should return identity provider metadata with updated data on first user update', async () => {
      // Given
      accountServiceMock.updatePreferences.mockReset();
      accountServiceMock.updatePreferences.mockResolvedValueOnce({
        updatedAt: new Date('2024-02-01'),
      });

      // When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        idpListMock,
        allowFutureIdp,
      );

      // Then
      expect(updatedIdpSettings).toEqual({
        formattedIdpSettingsList: formattedIdpSettingsListMock,
        updatedIdpSettingsList: updatedIdpIdpSettingListMock,
        hasAllowFutureIdpChanged: true,
        updatedAt: new Date('2024-02-01'),
      });
    });
  });

  describe('getFormattedIdpSettingsLists', () => {
    beforeEach(() => {
      service['formatIdpSettings'] = jest
        .fn()
        .mockReturnValueOnce({
          idpList: formattedIdpSettingsListMock,
          allowFutureIdp: false,
        })
        .mockReturnValueOnce({
          idpList: formattedPreviousIdpSettingsListMock,
          allowFutureIdp: false,
        });
    });
    it('should call formatIdpSettings twice', () => {
      // WHEN
      const result = service['getFormattedIdpSettingsLists']({
        idpList: identityProviderMetadataMock,
        currentSettings: createIdpSettingsResultMock,
        previousSettings: accountBeforeUpdate.preferences.idpSettings,
      });

      // THEN
      expect(service['formatIdpSettings']).toHaveBeenCalledTimes(2);
      expect(service['formatIdpSettings']).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        createIdpSettingsResultMock,
      );
      expect(service['formatIdpSettings']).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        accountBeforeUpdate.preferences.idpSettings,
      );
      expect(result).toEqual({
        formattedIdpSettingsList: formattedIdpSettingsListMock,
        formattedPreviousIdpSettingsList: formattedPreviousIdpSettingsListMock,
      });
    });
  });

  describe('getIdentityProviderList', () => {
    const aidantsConnectUid = 'aidants-connect';

    const appConfigMock = {
      aidantsConnectUid,
    };

    const identityProviderMetadataWithAidantConnectMock = [
      {
        uid: 'foo',
        title: 'foo Title',
      },
      {
        uid: 'bar',
        title: 'bar Title',
      },
      {
        uid: aidantsConnectUid,
        title: 'Aidants Connect Title',
      },
    ] as IdentityProviderMetadata[];

    beforeEach(() => {
      configMock.get.mockReturnValueOnce(appConfigMock);
      identityProviderServiceMock.getList.mockResolvedValueOnce(
        identityProviderMetadataWithAidantConnectMock,
      );
    });

    it('should retrieve the aidants connect uid from the app config', async () => {
      // WHEN
      await service['getIdentityProviderList']();

      // THEN
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('App');
    });

    it('should call identityProvider.getList', async () => {
      // WHEN
      await service['getIdentityProviderList']();

      // THEN
      expect(identityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
      expect(identityProviderServiceMock.getList).toHaveBeenCalledWith();
    });

    it('should return a list without aidants connect IdP', async () => {
      // GIVEN
      const expectedList = [
        {
          uid: 'foo',
          title: 'foo Title',
        },
        {
          uid: 'bar',
          title: 'bar Title',
        },
      ];

      // WHEN
      const result = await service['getIdentityProviderList']();

      // THEN
      expect(result).toStrictEqual(expectedList);
    });
  });
});
