import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Test, TestingModule } from '@nestjs/testing';

import { CoreInstance } from '../enums';
import { CsmrTracksUnknownInstanceException } from '../exceptions';
import {
  TracksFcpHighFormatter,
  TracksFcpLowFormatter,
  TracksLegacyFormatter,
  TracksV2Formatter,
} from '../formatters';
import { ICsmrTracksData } from '../interfaces';
import { CsmrTracksFormatterService } from './csmr-tracks-formatter.service';

describe('CsmrTracksFormatterService', () => {
  let service: CsmrTracksFormatterService;

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
        CsmrTracksFormatterService,
        TracksFcpHighFormatter,
        TracksFcpLowFormatter,
        TracksLegacyFormatter,
      ],
    })
      .overrideProvider(TracksV2Formatter)
      .useValue(formatterFcpHighMock)
      .overrideProvider(TracksFcpHighFormatter)
      .useValue(formatterFcpHighMock)
      .overrideProvider(TracksFcpLowFormatter)
      .useValue(formatterFcpLowMock)
      .overrideProvider(TracksLegacyFormatter)
      .useValue(formatterLegacyMock)
      .compile();

    service = module.get<CsmrTracksFormatterService>(
      CsmrTracksFormatterService,
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
      ] as unknown as SearchHit<ICsmrTracksData>[];

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
      ] as unknown as SearchHit<ICsmrTracksData>[];

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
      const tracks = [trackUnknown] as unknown as SearchHit<ICsmrTracksData>[];

      // When
      const result = () => service.formatTracks(tracks);

      // Then
      expect(result).toThrow(CsmrTracksUnknownInstanceException);
    });
  });
});
