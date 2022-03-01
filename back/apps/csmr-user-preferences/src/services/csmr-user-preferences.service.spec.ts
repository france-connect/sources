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
  const accountMock: Account = {
    id: '42',
    preferences: {
      updatedAt: new Date(),
      identityProviderList: ['bar'],
      isExcludeList: false,
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
  const createAccountPreferencesIdpListResultMock = {
    isExcludeList: false,
    identityProviderList: ['bar'],
  };
  const updatedAccount = {
    ...accountMock,
    preferences: {
      updatedAt: new Date(),
      identityProviderList: idpListMock,
      isExcludeList: true,
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

  const createAccountPreferencesIdpListMock = jest.fn();

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
        identityProviderList: ['foo'],
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual([
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
      ]);
    });

    it('should filter idp we should not display', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        identityProviderList: ['foo'],
      };
      const metadataMock = [
        {
          uid: 'foo',
          title: 'foo Title',
          name: 'Foo',
          image: 'foo.png',
          display: false,
          active: true,
          discovery: true,
        },
        identityProviderMetadataMock[1],
      ] as IdentityProviderMetadata[];

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        metadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual([
        {
          uid: 'bar',
          title: 'bar Title',
          name: 'Bar',
          image: 'bar.png',
          active: true,
          isChecked: false,
        },
      ]);
    });

    it('should return an identity provider list with isCheck set to true if identity provider list is empty', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        identityProviderList: [],
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual([
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
      ]);
    });

    it('should return an identity provider list with isCheck set to true if preferences have not been set by user', () => {
      // Given
      preferencesMock = undefined;

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual([
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
      ]);
    });

    it('should return an identity provider list for inclusive list', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: false,
        identityProviderList: ['foo'],
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual([
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
      ]);
    });

    it('should return an identity provider list for exclusive list', () => {
      // Given
      preferencesMock = {
        updatedAt: new Date(),
        isExcludeList: true,
        identityProviderList: ['foo'],
      };

      // When
      const idpSettingsList = service.formatUserIdpSettingsList(
        identityProviderMetadataMock,
        preferencesMock,
      );

      // Then
      expect(idpSettingsList).toEqual([
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
      ]);
    });
  });

  describe('createAccountPreferencesIdpList', () => {
    it('should return an inclusive idp list if future idp are disabled', () => {
      // Given
      const identityProviderUids = ['one', 'two', 'three', 'four'];
      const idpList = ['one', 'two'];

      // When
      const idpPreferences = service.createAccountPreferencesIdpList(
        idpList,
        false,
        identityProviderUids,
      );

      // Then
      expect(idpPreferences).toEqual({
        isExcludeList: false,
        identityProviderList: idpList,
      });
    });

    it('should return a list that exclude idp if future idp are enabled', () => {
      // Given
      const identityProviderUids = ['one', 'two', 'three', 'four'];
      const idpList = ['one', 'two'];

      // When
      const idpPreferences = service.createAccountPreferencesIdpList(
        idpList,
        true,
        identityProviderUids,
      );

      // Then
      expect(idpPreferences).toEqual({
        isExcludeList: true,
        identityProviderList: ['three', 'four'],
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

    it('Should return identity provider metadatas data', async () => {
      // When
      const idpSettings = await service.getIdpSettings(identityMock);
      // Then
      expect(idpSettings).toEqual(formatUserIdpSettingsListResultMock);
    });

    it('Should compute the identityHash from the identity', async () => {
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

    it('Should get an Account object from an identityHash', async () => {
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

    it('Should throw an error `AccountNotFoundException` if no account found for an `identityHash`', async () => {
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
        accountMock.preferences,
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

      service.createAccountPreferencesIdpList =
        createAccountPreferencesIdpListMock.mockReturnValueOnce(
          createAccountPreferencesIdpListResultMock,
        );
    });

    it('Should return identity provider metadata with updated data', async () => {
      // Given / When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        idpListMock,
        false,
      );
      // Then
      expect(updatedIdpSettings).toEqual(formatUserIdpSettingsListResultMock);
    });

    it('Should get the metadata idp list', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(identityProviderServiceMock.getList).toHaveBeenCalledTimes(1);
    });

    it('Should compute the identityHash from the identity', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(identityMock);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
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
      const uids = identityProviderMetadataMock.map((idp) => idp.uid);
      const allowFutureIdp = false;
      // When
      await service.setIdpSettings(identityMock, idpListMock, allowFutureIdp);
      // Then
      expect(createAccountPreferencesIdpListMock).toBeCalledWith(
        idpListMock,
        allowFutureIdp,
        uids,
      );
      expect(createAccountPreferencesIdpListMock).toHaveBeenCalledTimes(1);
    });

    it('Should update account from identity hash and the account preferences generated and get the updated account', async () => {
      // Given
      const { isExcludeList, identityProviderList } =
        createAccountPreferencesIdpListResultMock;
      // When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(accountServiceMock.updatePreferences).toBeCalledWith(
        identityHashMock,
        identityProviderList,
        isExcludeList,
      );
      expect(accountServiceMock.updatePreferences).toHaveBeenCalledTimes(1);
    });

    it('should format metadata in order to clean data and add a "isCheck" property', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, idpListMock, false);
      // Then
      expect(formatUserIdpSettingsListMock).toHaveBeenCalledTimes(1);
      expect(formatUserIdpSettingsListMock).toHaveBeenCalledWith(
        identityProviderMetadataMock,
        updatedAccount.preferences,
      );
    });
  });
});
