import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CsmrAggregrateTracksFactoryService } from './csmr-aggregate-tracks-factory.service';

describe('CsmrTracksFactoryService', () => {
  let service: CsmrAggregrateTracksFactoryService;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

  const tracksHighMock = [
    {
      time: 1601503200000, // '01/10/2020'
      event: 'high_event2',
    },
    {
      time: 970351200000, // '01/10/2000'
      event: 'high_event1',
    },
  ] as unknown as ICsmrTracksOutputTrack[];

  const tracksLegacyMock = [
    {
      time: 1604185200000, // '01/11/2020'
      event: 'legacy_event2',
    },
    {
      time: 970437600000, // '02/10/2000'
      event: 'legacy_event1',
    },
  ] as unknown as ICsmrTracksOutputTrack[];

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrAggregrateTracksFactoryService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<CsmrAggregrateTracksFactoryService>(
      CsmrAggregrateTracksFactoryService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith(
      'CsmrAggregrateTracksFactoryService',
    );
  });

  describe('mergeGroups()', () => {
    it('should merge tracks from groups', () => {
      // Given
      const groups = [tracksHighMock, tracksLegacyMock];
      // When
      const results = service.mergeGroups(groups);

      // Then
      expect(results).toStrictEqual([
        tracksHighMock[1],
        tracksLegacyMock[1],
        tracksHighMock[0],
        tracksLegacyMock[0],
      ]);
    });

    it('should throw an error if format failed', () => {
      // Given
      const wrongTracks = [null] as unknown as ICsmrTracksOutputTrack[];

      const groups = [tracksHighMock, wrongTracks];

      // When
      expect(
        () => service.mergeGroups(groups),
        // Then
      ).toThrow(TypeError);
    });
  });
});
