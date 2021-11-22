import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountNotFoundException, AccountService } from '@fc/account';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger';

import { CsrmTracksNoTracksException } from '../exceptions';
import { CsmrTracksService } from './csmr-tracks.service';
import { CsmrTracksElasticsearchService } from './csmr-tracks-elasticsearch.service';

const identityMock = {
  // scope openid @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
  // eslint-disable-next-line @typescript-eslint/naming-convention
  given_name: 'Jean Paul Henri',
  // scope openid @see https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
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
} as Account;
const tracksMock = 'tracksMockValue';

const loggerServiceMock = {
  setContext: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
} as unknown as LoggerService;

const accountServiceMock = {
  storeInteraction: jest.fn(),
  isBlocked: jest.fn(),
  getAccountByIdentityHash: jest.fn(),
};

const cryptographyFcpServiceMock = {
  computeSubV1: jest.fn(),
  computeIdentityHash: jest.fn(),
};

const csmrTracksElasticsearchServiceMock = {
  getTracksByAccountId: jest.fn(),
};

describe('CsmrTracksService', () => {
  let service: CsmrTracksService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksService],
      providers: [
        LoggerService,
        AccountService,
        CryptographyFcpService,
        CsmrTracksElasticsearchService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpServiceMock)
      .overrideProvider(CsmrTracksElasticsearchService)
      .useValue(csmrTracksElasticsearchServiceMock)
      .compile();

    service = app.get<CsmrTracksService>(CsmrTracksService);
  });

  describe('getList()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountMock,
      );
      csmrTracksElasticsearchServiceMock.getTracksByAccountId.mockResolvedValueOnce(
        tracksMock,
      );
    });

    it('Should compute the identityHash from the identity.', async () => {
      // Given / When
      await service.getList(identityMock);
      // Then
      expect(
        cryptographyFcpServiceMock.computeIdentityHash,
      ).toHaveBeenCalledWith(identityMock);
    });

    it('Should get an Account object from an identityHash', async () => {
      // Given / When
      await service.getList(identityMock);
      // Then
      expect(accountServiceMock.getAccountByIdentityHash).toHaveBeenCalledWith(
        identityHashMock,
      );
    });

    it('Should throw an error `CsrmTracksNoTracksException` if no tracks have been found for this account', async () => {
      // Given / When
      jest.resetAllMocks();
      jest.restoreAllMocks();

      cryptographyFcpServiceMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountMock,
      );
      csmrTracksElasticsearchServiceMock.getTracksByAccountId.mockResolvedValueOnce(
        [],
      );
      const exceptionMock = new CsrmTracksNoTracksException();
      // Then
      await expect(() => service.getList(identityMock)).rejects.toThrow(
        exceptionMock,
      );
    });

    it('Should throw an error `AccountNotFoundException` if no account found for an `identityHash`', async () => {
      // Given
      jest.resetAllMocks();
      jest.restoreAllMocks();

      const accountEmptyMock = { id: null };
      const noAccountMock = new AccountNotFoundException();
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountEmptyMock,
      );
      // When / Then
      await expect(() => service.getList(identityMock)).rejects.toThrow(
        noAccountMock,
      );
    });

    it('Should get the coresponding tracks from account.id.', async () => {
      // Given / When
      await service.getList(identityMock);
      // Then
      expect(
        csmrTracksElasticsearchServiceMock.getTracksByAccountId,
      ).toHaveBeenCalledWith(accountMock.id);
    });

    it('Should return JSON mock data', async () => {
      // Given / When
      const result = await service.getList(identityMock);
      // Then
      expect(result).toEqual(tracksMock);
    });
  });
});
