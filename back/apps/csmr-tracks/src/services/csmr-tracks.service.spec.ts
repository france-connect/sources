import { Test, TestingModule } from '@nestjs/testing';

import { Account, AccountService } from '@fc/account';
import { LoggerService } from '@fc/logger-legacy';

import { CsmrTracksService } from './csmr-tracks.service';
import { CsmrTracksElasticsearchService } from './csmr-tracks-elasticsearch.service';

const identityHashMock = 'identityHashMockValue';
const accountMock: Account = {
  id: '42',
} as Account;
const tracksMock = [Symbol('tracksMockValue')];

const loggerServiceMock = {
  setContext: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
} as unknown as LoggerService;

const accountServiceMock = {
  getAccountByIdentityHash: jest.fn(),
};

const csmrTracksElasticsearchServiceMock = {
  getTracksByAccountId: jest.fn(),
};

describe('CsmrTracksService', () => {
  let service: CsmrTracksService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksService],
      providers: [
        LoggerService,
        AccountService,
        CsmrTracksElasticsearchService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(AccountService)
      .useValue(accountServiceMock)
      .overrideProvider(CsmrTracksElasticsearchService)
      .useValue(csmrTracksElasticsearchServiceMock)
      .compile();

    service = app.get<CsmrTracksService>(CsmrTracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getList()', () => {
    beforeEach(() => {
      accountServiceMock.getAccountByIdentityHash.mockResolvedValueOnce(
        accountMock,
      );
      csmrTracksElasticsearchServiceMock.getTracksByAccountId.mockResolvedValueOnce(
        tracksMock,
      );
    });

    it('Should get an Account object from an identityHash', async () => {
      // Given / When
      await service.getList(identityHashMock);
      // Then
      expect(accountServiceMock.getAccountByIdentityHash).toHaveBeenCalledWith(
        identityHashMock,
      );
    });

    it('Should return a empty array if no tracks have been found for this account', async () => {
      // Given
      csmrTracksElasticsearchServiceMock.getTracksByAccountId
        .mockReset()
        .mockResolvedValueOnce([]);

      // When
      const result = await service.getList(identityHashMock);
      // Then
      expect(result).toStrictEqual([]);
    });

    it('Should return a empty array if no account found for an `identityHash`', async () => {
      // Given
      const accountEmptyMock = { id: null };
      accountServiceMock.getAccountByIdentityHash
        .mockReset()
        .mockResolvedValueOnce(accountEmptyMock);

      // When
      const result = await service.getList(identityHashMock);
      // Then
      expect(result).toStrictEqual([]);
    });

    it('Should get the corresponding tracks from account.id', async () => {
      // Given / When
      await service.getList(identityHashMock);
      // Then
      expect(
        csmrTracksElasticsearchServiceMock.getTracksByAccountId,
      ).toHaveBeenCalledTimes(1);
      expect(
        csmrTracksElasticsearchServiceMock.getTracksByAccountId,
      ).toHaveBeenCalledWith(accountMock.id);
    });

    it('Should return JSON mock data', async () => {
      // Given / When
      const result = await service.getList(identityHashMock);
      // Then
      expect(result).toStrictEqual(tracksMock);
    });
  });
});
