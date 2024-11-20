import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';
import { CsmrAccountClientService } from '@fc/csmr-account-client';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { TracksAdapterElasticsearchService } from '@fc/tracks-adapter-elasticsearch';

import { getLoggerMock } from '@mocks/logger';

import { CsmrTracksService } from './csmr-tracks.service';

describe('CsmrTracksService', () => {
  let service: CsmrTracksService;

  const loggerMock = getLoggerMock();

  const accountMock = {
    getAccountIdsFromIdentity: jest.fn(),
  };

  const tracksAdapterMock = {
    getTracks: jest.fn(),
  };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CsmrTracksService,
        LoggerService,
        CsmrAccountClientService,
        TracksAdapterElasticsearchService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CsmrAccountClientService)
      .useValue(accountMock)
      .overrideProvider(TracksAdapterElasticsearchService)
      .useValue(tracksAdapterMock)
      .compile();

    service = module.get<CsmrTracksService>(CsmrTracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTracksForIdentity', () => {
    // Given
    const identityMock = Symbol('identityMock') as unknown as IOidcIdentity;
    const accountIdsMock = ['accountIdsMock'];
    const totalMock = Symbol('tracksTotalMock');
    const formattedTracksMock = Symbol('formattedTracksMock');
    const tracksAdapterResultsMock = {
      total: totalMock,
      payload: formattedTracksMock,
    };
    const optionsMock = {} as IPaginationOptions;
    const paginationResultsMock = {
      ...optionsMock,
      total: totalMock,
    };
    const tracksResultsMock = {
      meta: paginationResultsMock,
      payload: formattedTracksMock,
    };

    beforeEach(() => {
      accountMock.getAccountIdsFromIdentity.mockResolvedValue(accountIdsMock);
      tracksAdapterMock.getTracks.mockReturnValueOnce(tracksAdapterResultsMock);
    });

    it('should call accountMock.getIdsWithIdentityHash() with identity ', async () => {
      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(accountMock.getAccountIdsFromIdentity).toHaveBeenCalledTimes(1);
      expect(accountMock.getAccountIdsFromIdentity).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should call tracks.getTracks() with accountIds from getIdsWithIdentityHash', async () => {
      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(tracksAdapterMock.getTracks).toHaveBeenCalledTimes(1);
      expect(tracksAdapterMock.getTracks).toHaveBeenCalledWith(
        accountIdsMock,
        optionsMock,
      );
    });

    it('should call this.getPaginationResults() with options and total', async () => {
      // Given
      service['getPaginationResults'] = jest.fn();

      // When
      await service.getTracksForIdentity(identityMock, optionsMock);

      // Then
      expect(service['getPaginationResults']).toHaveBeenCalledTimes(1);
      expect(service['getPaginationResults']).toHaveBeenCalledWith(
        optionsMock,
        tracksAdapterResultsMock.total,
      );
    });

    it('should return an object with formatted tracks and metadata', async () => {
      // When
      const tracks = await service.getTracksForIdentity(
        identityMock,
        optionsMock,
      );
      // Then
      expect(tracks).toEqual(tracksResultsMock);
    });

    it('should return result generateEmptyResults() if no accountIds are found', async () => {
      // Given
      accountMock.getAccountIdsFromIdentity.mockResolvedValueOnce([]);
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
      } as unknown as IPaginationOptions;
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

  describe('getPaginationResults', () => {
    it('should return an object with total and options', () => {
      // Given
      const totalMock = Symbol('totalMock') as unknown as number;
      const sizeMock = Symbol('sizeMock');
      const offsetMock = Symbol('offsetMock');
      const optionsMock = {
        size: sizeMock,
        offset: offsetMock,
      } as unknown as IPaginationOptions;

      const paginationResultMock = {
        total: totalMock,
        size: sizeMock,
        offset: offsetMock,
      };

      // When
      const result = service['getPaginationResults'](optionsMock, totalMock);

      // Then
      expect(result).toEqual(paginationResultMock);
    });
  });
});
