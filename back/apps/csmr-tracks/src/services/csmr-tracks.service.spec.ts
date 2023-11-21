import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';

import { getLoggerMock } from '@mocks/logger-legacy';

import { CsmrTracksService } from './csmr-tracks.service';
import { CsmrTracksAccountService } from './csmr-tracks-account.service';
import { CsmrTracksElasticService } from './csmr-tracks-elastic.service';
import { CsmrTracksFormatterService } from './csmr-tracks-formatter.service';

describe('CsmrTracksService', () => {
  let service: CsmrTracksService;

  const loggerMock = getLoggerMock();

  const accountMock = {
    getIdsWithIdentityHash: jest.fn(),
  };

  const elasticMock = {
    getTracks: jest.fn(),
  };

  const formatterMock = {
    formatTracks: jest.fn(),
  };

  const cryptographyFcpMock = {
    computeIdentityHash: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksService,
        LoggerService,
        CryptographyFcpService,
        CsmrTracksAccountService,
        CsmrTracksElasticService,
        CsmrTracksFormatterService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpMock)
      .overrideProvider(CsmrTracksAccountService)
      .useValue(accountMock)
      .overrideProvider(CsmrTracksElasticService)
      .useValue(elasticMock)
      .overrideProvider(CsmrTracksFormatterService)
      .useValue(formatterMock)
      .compile();

    service = module.get<CsmrTracksService>(CsmrTracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTracksForIdentity', () => {
    // Given
    const identityMock = Symbol('identityMock') as unknown as IOidcIdentity;
    const identityHashMock = Symbol('identityHashMock');
    const accountIdsMock = ['accountIdsMock'];
    const elasticTracksMock = {
      meta: Symbol('elasticMetaMock'),
      payload: Symbol('elasticPayloadMock'),
    };
    const formattedTracksMock = Symbol('formattedTracksMock');
    const optionsMock = {} as IPaginationOptions;

    beforeEach(() => {
      cryptographyFcpMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      elasticMock.getTracks.mockResolvedValueOnce(elasticTracksMock);
      formatterMock.formatTracks.mockReturnValueOnce(formattedTracksMock);
      accountMock.getIdsWithIdentityHash.mockResolvedValue(accountIdsMock);
    });

    it('should call cryptographyFcpMock.computeIdentityHash() with identity', async () => {
      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should call accountMock.getIdsWithIdentityHash() with identityHash from computeIdentityHash', async () => {
      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(accountMock.getIdsWithIdentityHash).toHaveBeenCalledTimes(1);
      expect(accountMock.getIdsWithIdentityHash).toHaveBeenCalledWith(
        identityHashMock,
      );
    });

    it('should call elastic.getTracks() with accountIds from getIdsWithIdentityHash', async () => {
      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(elasticMock.getTracks).toHaveBeenCalledTimes(1);
      expect(elasticMock.getTracks).toHaveBeenCalledWith(
        accountIdsMock,
        optionsMock,
      );
    });

    it('should call formatter.formatTracks() with results from elastic', async () => {
      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(formatterMock.formatTracks).toHaveBeenCalledTimes(1);
      expect(formatterMock.formatTracks).toHaveBeenCalledWith(
        elasticTracksMock.payload,
      );
    });

    it('should return an object with formatted tracks and metadata from elastic', async () => {
      // When
      const tracks = await service.getTracksForIdentity(
        identityMock,
        optionsMock,
      );
      // Then
      expect(tracks).toEqual({
        meta: elasticTracksMock.meta,
        payload: formattedTracksMock,
      });
    });

    it('should return result generateEmptyResults() if no accountIds are found', async () => {
      // Given
      accountMock.getIdsWithIdentityHash.mockResolvedValueOnce([]);
      const emptyResultMock = Symbol('emptyResultMock');
      service['generateEmptyResults'] = jest
        .fn()
        .mockReturnValueOnce(emptyResultMock);

      // When
      const tracks = await service.getTracksForIdentity(
        identityMock,
        optionsMock,
      );
      // Then
      expect(tracks).toBe(emptyResultMock);
    });
  });

  describe('generateEmptyResults', () => {
    it('should return a result with empty payload and metadata', () => {
      // Given
      const sizeMock = Symbol('sizeMock');
      const offsetMock = Symbol('offsetMock');
      const optionsMock = {
        size: sizeMock,
        offset: offsetMock,
      };
      const expectedResultMock = {
        meta: {
          total: 0,
          size: sizeMock,
          offset: offsetMock,
        },
        payload: [],
      };

      // When
      const result = service['generateEmptyResults'](optionsMock);

      // Then
      expect(result).toEqual(expectedResultMock);
    });
  });
});
