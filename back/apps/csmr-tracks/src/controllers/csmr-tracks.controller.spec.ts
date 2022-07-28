import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger-legacy';

import {
  CsmrTracksAccountService,
  CsmrTracksElasticService,
  CsmrTracksFormatterService,
} from '../services';
import { CsmrTracksController } from './csmr-tracks.controller';

describe('CsmrTracksController', () => {
  let controller: CsmrTracksController;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const accountMock = {
    getIdsWithIdentityHash: jest.fn(),
  };

  const elasticMock = {
    getTracks: jest.fn(),
  };

  const tracksMock = {
    formatTracks: jest.fn(),
  };

  const identityMock = Symbol('identityValue');
  const optionsMock: IPaginationOptions = {
    offset: 12,
    size: 42,
  };
  const payloadMock = {
    identity: identityMock,
    options: optionsMock,
  };

  const identityHashMock = Symbol('identityHashValue');
  const groupIdsMock = ['idValue1', 'idValue2'];
  const rawDataMock = {
    meta: {
      total: 2,
      size: optionsMock.size,
      offset: optionsMock.offset,
    },
    payload: ['rawTracks1', 'rawTracks2'],
  };

  const payloadTracksMock = ['tracks1', 'tracks2'];

  const tracksDataMock = {
    meta: rawDataMock.meta,
    payload: payloadTracksMock,
  };

  const cryptographyFcpMock = {
    computeIdentityHash: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksController],
      providers: [
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
      .useValue(tracksMock)
      .compile();

    controller = app.get<CsmrTracksController>(CsmrTracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith('CsmrTracksController');
  });

  describe('aggregateTracks()', () => {
    beforeEach(() => {
      cryptographyFcpMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      accountMock.getIdsWithIdentityHash.mockResolvedValueOnce(groupIdsMock);
      elasticMock.getTracks.mockResolvedValueOnce(rawDataMock);
      tracksMock.formatTracks.mockReturnValueOnce(payloadTracksMock);
    });

    it('Should find identityHash from identity', async () => {
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('Should find account ids from identityHash', async () => {
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(accountMock.getIdsWithIdentityHash).toHaveBeenCalledTimes(1);
      expect(accountMock.getIdsWithIdentityHash).toHaveBeenCalledWith(
        identityHashMock,
      );
    });

    it('should get raw tracks from database with group of ids', async () => {
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(elasticMock.getTracks).toHaveBeenCalledTimes(1);
      expect(elasticMock.getTracks).toHaveBeenCalledWith(
        groupIdsMock,
        optionsMock,
      );
    });

    it('Should format raw data into valuable tracks', async () => {
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(tracksMock.formatTracks).toHaveBeenCalledTimes(1);
      expect(tracksMock.formatTracks).toHaveBeenCalledWith(rawDataMock.payload);
    });

    it('Should return tracks requested based on identity information', async () => {
      // When
      const result = await controller.aggregateTracks(payloadMock);
      // Then
      expect(result).toStrictEqual(tracksDataMock);
    });

    it('should return empty array if no account id was found', async () => {
      // Given
      accountMock.getIdsWithIdentityHash.mockReset().mockResolvedValueOnce([]);

      const resultMock = {
        meta: {
          total: 0,
          size: optionsMock.size,
          offset: optionsMock.offset,
        },
        payload: [],
      };
      // When
      const result = await controller.aggregateTracks(payloadMock);
      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it("should return 'ERROR' if service failed", async () => {
      // Given
      accountMock.getIdsWithIdentityHash
        .mockReset()
        .mockImplementationOnce(() => {
          throw new Error('Unknown Error');
        });
      // When
      const result = await controller.aggregateTracks(payloadMock);
      // Then
      expect(result).toStrictEqual('ERROR');
    });
  });
});
