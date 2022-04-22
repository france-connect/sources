import { Test, TestingModule } from '@nestjs/testing';

import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger-legacy';

import {
  CsmrAggregateTracksAggregationFailedException,
  CsmrAggregateTracksFormatTracksFailedException,
} from '../exceptions';
import {
  CmsrAggregateTracksBrokerService,
  CsmrAggregrateTracksFactoryService,
} from '../services';
import { CsmrAggregateTracksController } from './csmr-aggregate-tracks.controller';

describe('CsmrTracksController', () => {
  let controller: CsmrAggregateTracksController;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const identityMock = Symbol('identityValue');
  const payloadMock = {
    identity: identityMock,
  };

  const identityHashMock = Symbol('identityHashValue');

  const coreHighMock = [Symbol('tracksHigh')];
  const coreLegacyMock = [Symbol('tracksLegacy')];
  const tracksGroupMock = [coreHighMock, coreLegacyMock];
  const tracksMock = [...coreHighMock, ...coreLegacyMock];

  const cryptographyFcpMock = {
    computeIdentityHash: jest.fn(),
  };

  const brokerMock = {
    getTracksGroup: jest.fn(),
  };

  const factoryMock = {
    mergeGroups: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrAggregateTracksController],
      providers: [
        LoggerService,
        CryptographyFcpService,
        CmsrAggregateTracksBrokerService,
        CsmrAggregrateTracksFactoryService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .overrideProvider(CryptographyFcpService)
      .useValue(cryptographyFcpMock)
      .overrideProvider(CmsrAggregateTracksBrokerService)
      .useValue(brokerMock)
      .overrideProvider(CsmrAggregrateTracksFactoryService)
      .useValue(factoryMock)
      .compile();

    controller = app.get<CsmrAggregateTracksController>(
      CsmrAggregateTracksController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith(
      'CsmrAggregateTracksController',
    );
  });

  describe('aggregateTracks()', () => {
    beforeEach(() => {
      cryptographyFcpMock.computeIdentityHash.mockReturnValueOnce(
        identityHashMock,
      );
      brokerMock.getTracksGroup.mockResolvedValueOnce(tracksGroupMock);
      factoryMock.mergeGroups.mockReturnValueOnce(tracksMock);
    });
    it('Should find identityHash from identity', async () => {
      // Given / When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledTimes(1);
      expect(cryptographyFcpMock.computeIdentityHash).toHaveBeenCalledWith(
        identityMock,
      );
    });

    it('should get groups of tracks from broker with identityHash', async () => {
      // Given
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(brokerMock.getTracksGroup).toHaveBeenCalledTimes(1);
      expect(brokerMock.getTracksGroup).toHaveBeenCalledWith(identityHashMock);
    });

    it('should merge tracks from group of tracks', async () => {
      // Given
      // When
      await controller.aggregateTracks(payloadMock);
      // Then
      expect(factoryMock.mergeGroups).toHaveBeenCalledTimes(1);
      expect(factoryMock.mergeGroups).toHaveBeenCalledWith(tracksGroupMock);
    });

    it('should get tracks from identity', async () => {
      // Given
      // When
      const result = await controller.aggregateTracks(payloadMock);
      // Then
      expect(result).toStrictEqual(tracksMock);
    });

    it('Should throw an exception if an error is throwed in aggregating process', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      brokerMock.getTracksGroup.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });
      await expect(
        // When
        controller.aggregateTracks(payloadMock),
        // Then
      ).rejects.toThrow(CsmrAggregateTracksAggregationFailedException);
    });

    it('Should throw an exception if an error is throwed in merging process', async () => {
      // Given
      const errorMock = new Error('Unknown Error');
      factoryMock.mergeGroups.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });
      await expect(
        // When
        controller.aggregateTracks(payloadMock),
        // Then
      ).rejects.toThrow(CsmrAggregateTracksFormatTracksFailedException);
    });
  });
});
