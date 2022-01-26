import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountNotFoundException, AccountService } from '@fc/account';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger';

import { UserPreferencesFcpService } from './user-preferences-fcp.service';

describe('UserPreferencesFcpService', () => {
  let service: UserPreferencesFcpService;

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
    idpSettings: {
      updatedAt: new Date(),
      includeList: ['bar'],
    },
  } as Account;
  const includeListMock = ['foo', 'idp_id_x', 'idp_id_y'];
  const updatedAccount = {
    ...accountMock,
    idpSettings: { updatedAt: Date.now(), includeList: includeListMock },
  };

  const loggerServiceMock = {
    setContext: jest.fn(),
    debug: jest.fn(),
    trace: jest.fn(),
  } as unknown as LoggerService;

  const accountServiceMock = {
    getAccountByIdentityHash: jest.fn(),
    updateIdpSettings: jest.fn(),
  };

  const cryptographyFcpServiceMock = {
    computeIdentityHash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPreferencesFcpService],
      providers: [LoggerService, AccountService, CryptographyFcpService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpServiceMock)
      .compile();

    service = module.get<UserPreferencesFcpService>(UserPreferencesFcpService);
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
    });

    it('Should return `idpSettings` data', async () => {
      // Given / When
      const idpSettings = await service.getIdpSettings(identityMock);
      // Then
      expect(idpSettings).toEqual(accountMock.idpSettings);
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

    it('Should return an empty includeList if idpSettings is undefined or null', async () => {
      // Given
      const accountWithoutIdpSettings = {
        ...accountMock,
        idpSettings: undefined,
      };
      accountServiceMock.getAccountByIdentityHash
        .mockReset()
        .mockResolvedValueOnce(accountWithoutIdpSettings);
      // When
      const idpSettings = await service.getIdpSettings(identityMock);
      // Then
      expect(idpSettings).toEqual({
        updatedAt: null,
        includeList: [],
      });
    });
  });

  describe('setIdpSettings()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.updateIdpSettings.mockResolvedValueOnce(
        updatedAccount,
      );
    });

    it('Should compute the identityHash from the identity', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, includeListMock);
      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(identityMock);
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledTimes(1);
    });

    it('Should update account from identity hash and an idpList and get the updated account', async () => {
      // Given / When
      await service.setIdpSettings(identityMock, includeListMock);
      // Then
      expect(accountServiceMock.updateIdpSettings).toBeCalledWith(
        identityHashMock,
        includeListMock,
      );
      expect(accountServiceMock.updateIdpSettings).toHaveBeenCalledTimes(1);
    });

    it('Should throw an error `AccountNotFoundException` if no account found for an `identityHash`', async () => {
      // Given
      const accountEmptyMock = { id: null };
      const noAccountMock = new AccountNotFoundException();
      accountServiceMock.updateIdpSettings
        .mockReset()
        .mockResolvedValueOnce(accountEmptyMock);
      // When / Then
      await expect(
        service.setIdpSettings(identityMock, includeListMock),
      ).rejects.toThrow(noAccountMock);
    });

    it('Should return `idpSettings` updated data', async () => {
      // Given / When
      const updatedIdpSettings = await service.setIdpSettings(
        identityMock,
        includeListMock,
      );
      // Then
      expect(updatedIdpSettings).toEqual(updatedAccount.idpSettings);
    });
  });
});
