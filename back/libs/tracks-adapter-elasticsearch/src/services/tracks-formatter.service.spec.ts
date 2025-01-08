import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { CoreInstance } from '../enums';
import { TracksFormatterUnknownInstanceException } from '../exceptions';
import {
  ElasticTracksType,
  TracksFormatterOutputAbstract,
} from '../interfaces';
import { TracksFormatterService } from './tracks-formatter.service';

describe('TracksFormatterService', () => {
  let service: TracksFormatterService<TracksFormatterOutputAbstract>;

  const formatterFcpHighMockFormattedTracksReturnValue = Symbol(
    'formatterFcpHighMockFormattedTracksReturnValue.formattedTracks',
  );

  const formatterFcpHighMock = {
    formatTrack: jest.fn(),
  };

  const formatterFcpLowMock = {
    formatTrack: jest.fn(),
  };

  const formatterLegacyMock = {
    formatTrack: jest.fn(),
  };

  const trackHigh = { _source: { service: CoreInstance.FCP_HIGH } };
  const trackLow = { _source: { service: CoreInstance.FCP_LOW } };
  const trackLegacy = { _source: { service: CoreInstance.FC_LEGACY } };
  const trackUnknown = { _source: { service: 'some random invalid value' } };
  const trackMissingService = { _source: { service: '' } };

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksFormatterService,
        {
          provide: 'TracksFcpHighFormatter',
          useValue: formatterFcpHighMock,
        },
        {
          provide: 'TracksFcpLowFormatter',
          useValue: formatterFcpLowMock,
        },
        {
          provide: 'TracksLegacyFormatter',
          useValue: formatterLegacyMock,
        },
      ],
    }).compile();

    service = module.get<TracksFormatterService<TracksFormatterOutputAbstract>>(
      TracksFormatterService,
    );

    formatterFcpHighMock.formatTrack.mockReturnValue(
      formatterFcpHighMockFormattedTracksReturnValue,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('formatTracks()', () => {
    it('should dispatch tracks to corresponding formatter', () => {
      // Given
      const tracks = [
        trackHigh,
        trackLow,
        trackLegacy,
      ] as unknown as SearchHit<ElasticTracksType>[];

      // When
      service.formatTracks(tracks);

      // Then
      expect(formatterFcpHighMock.formatTrack).toHaveBeenCalledOnce();
      expect(formatterFcpHighMock.formatTrack).toHaveBeenCalledWith(trackHigh);

      expect(formatterFcpLowMock.formatTrack).toHaveBeenCalledOnce();
      expect(formatterFcpLowMock.formatTrack).toHaveBeenCalledWith(trackLow);

      expect(formatterLegacyMock.formatTrack).toHaveBeenCalledOnce();
      expect(formatterLegacyMock.formatTrack).toHaveBeenCalledWith(trackLegacy);
    });

    it('should use legacy if no service is provided', () => {
      // Given
      const tracks = [
        trackMissingService,
      ] as unknown as SearchHit<ElasticTracksType>[];

      // When
      service.formatTracks(tracks);

      // Then
      expect(formatterLegacyMock.formatTrack).toHaveBeenCalledOnce();
      expect(formatterLegacyMock.formatTrack).toHaveBeenCalledWith(
        trackMissingService,
      );
    });

    it('should throw if instance is unknown', () => {
      // Given
      const tracks = [
        trackUnknown,
      ] as unknown as SearchHit<ElasticTracksType>[];

      // When
      const result = () => service.formatTracks(tracks);

      // Then
      expect(result).toThrow(TracksFormatterUnknownInstanceException);
    });
  });
});
