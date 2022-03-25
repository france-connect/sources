import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountNotFoundException, AccountService } from '@fc/account';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { IdentityProviderAdapterMongoService } from '@fc/identity-provider-adapter-mongo';
import { LoggerService } from '@fc/logger';
import { IdentityProviderMetadata } from '@fc/oidc';

import { CsmrUserPreferencesIdpNotFoundException } from '../exceptions';
import { CsmrUserPreferencesService } from './csmr-user-preferences.service';

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
  const accountMock = {
    id: '42',
    preferences: {
      idpSettings: {
        updatedAt: new Date(),
        list: ['bar'],
        isExcludeList: false,
      },
    },
  } as Account;
  const idpListMock = ['bar'];
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
  const createAccountPreferencesIdpSettingsResultMock = {
    isExcludeList: false,
    list: ['bar'],
  };
  const updatedAccount = {
    ...accountMock,
    preferences: {
      idpSettings: {
        updatedAt: new Date(),
        list: idpListMock,
        isExcludeList: true,
      },
    },
  } as Account;

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

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

  const formatUserIdpSettingsListMock = jest.fn();

  const createAccountPreferencesIdpSettingsMock = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CsmrUserPreferencesService],
      providers: [
        LoggerService,
        AccountService,
        CryptographyFcpService,
        IdentityProviderAdapterMongoService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
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
      jest.resetAllMocks();
      jest.restoreAllMocks();

      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountMock,
      );
      identityProviderServiceMock.getList.mockResolvedValueOnce(
        identityProviderMetadataMock,
      );
      service.formatUserIdpSettingsList =
        formatUserIdpSettingsListMock.mockReturnValueOnce(
          formatUserIdpSettingsListResultMock,
        );
    });

    it('should return identity provider metadatas data', async () => {
      // When
      const idpSettings = await service.getIdpSettings(identityMock);
      // Then
      expect(idpSettings).toEqual(formatUserIdpSettingsListResultMock);
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
      // When
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
      // Given / When
      await service.getIdpSettings(identityMock);
      // Then
      expect(identityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
    });

    it('should format metadata in order to clean data and add a "isCheck" property', async () => {
      // Given / When
      await service.getIdpSettings(identityMock);
      // Then
      expect(formatUserIdpSettingsListMock).toHaveBeenCalledTimes(1);
      expect(formatUserIdpSettingsListMock).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        accountMock.preferences.idpSettings,
      );
    });
  });

  describe('setIdpSettings()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.updatePreferences.mockResolvedValueOnce(
        updatedAccount,
      );
      identityProviderServiceMock.getList.mockResolvedValueOnce(
        identityProviderMetadataMock,
      );
      service.formatUserIdpSettingsList =
        formatUserIdpSettingsListMock.mockReturnValueOnce(
          formatUserIdpSettingsListResultMock,
        );

      service.createAccountPreferencesIdpSettings =
        createAccountPreferencesIdpSettingsMock.mockReturnValueOnce(
          createAccountPreferencesIdpSettingsResultMock,
        );
    });

    it('should return identity provider metadata with updated data', async () => {
      // Given / When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        idpListMock,
        false,
      );
      // Then
      expect(updatedIdpSettings).toEqual(formatUserIdpSettingsListResultMock);
    });

    it('should get the metadata idp list', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(identityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
      expect(identityProviderServiceMock.getList).toHaveBeenCalledWith();
    });

    it('should compute the identityHash from the identity', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, false);
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
        service.setIdpSettings(identityMock, idpList, false),
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
      expect(createAccountPreferencesIdpSettingsMock).toHaveBeenCalledTimes(1);
      expect(createAccountPreferencesIdpSettingsMock).toBeCalledWith(
        idpListMock,
        inputIsExcludeList,
        idpUids,
      );
    });

    it('should update account from identity hash and the account preferences generated and get the updated account', async () => {
      // Given
      const { isExcludeList, list } =
        createAccountPreferencesIdpSettingsResultMock;
      // When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(accountServiceMock.updatePreferences).toHaveBeenCalledTimes(1);
      expect(accountServiceMock.updatePreferences).toBeCalledWith(
        identityHashMock,
        list,
        isExcludeList,
      );
    });

    it('should format metadata in order to clean data and add a "isCheck" property', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(formatUserIdpSettingsListMock).toHaveBeenCalledTimes(1);
      expect(formatUserIdpSettingsListMock).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        updatedAccount.preferences.idpSettings,
      );
    });
  });
});
