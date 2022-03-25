import { Test, TestingModule } from '@nestjs/testing';

import { LoggerService } from '@fc/logger';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { ICsmrTracksInputHigh } from '../interfaces';
import { CsmrTracksHighDataService } from './csmr-tracks-data-high.service';

describe('CsmrTracksHighDataService', () => {
  let service: CsmrTracksHighDataService;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  } as unknown as LoggerService;

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [CsmrTracksHighDataService, LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
      .compile();

    service = module.get<CsmrTracksHighDataService>(CsmrTracksHighDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set logger context', () => {
    expect(loggerMock.setContext).toHaveBeenCalledTimes(1);
    expect(loggerMock.setContext).toHaveBeenCalledWith(
      'CsmrTracksHighDataService',
    );
  });

  describe('formatQuery()', () => {
    const indexMock = 'indexMockValue';
    const accountIdMock = 'accountIdMockValue';
    const requestMock = {
      body: { query: { match: { accountId: 'accountIdMockValue' } } },
      index: 'indexMockValue',
    };
    it('should format request with accountId and index', () => {
      const request = service.formatQuery(indexMock, accountIdMock);
      expect(request).toStrictEqual(requestMock);
    });
  });

  describe('formattedTracks', () => {
    it('should format tracks from raw tracks', async () => {
      const rawTracksMock: ICsmrTracksInputHigh[] = [
        {
          _index: 'fc',
          _type: 'doc',
          _id: 'xxzxzxzd4z5dz5',
          _score: 1,
          _source: {
            event: 'event1',
            date: '19/02/2022',
            accountId: '42',
            spId: '43',
            spName: 'spNameValue',
            spAcr: 'eidas1',
            country: 'countryValue',
            city: 'cityValue',
          },
        },
        {
          _index: 'fc',
          _type: 'doc',
          _id: 'xxzxzxzd4z5dz5',
          _score: 1,
          _source: {
            event: 'event2',
            date: '20/02/2022',
            accountId: '42',
            spId: '43',
            spName: 'spNameValue',
            spAcr: 'eidas2',
            country: 'countryValue',
            city: 'cityValue',
          },
        },
        {
          _index: 'fc',
          _type: 'doc',
          _id: 'xxzxzxzd4z5dz5',
          _score: 1,
          _source: {
            event: 'event3',
            date: '23/02/2022',
            accountId: '42',
            spId: '43',
            spName: 'spNameValue',
            spAcr: 'eidas3',
            country: 'countryValue',
            city: 'cityValue',
          },
        },
      ];
      const tracksOutputMock: ICsmrTracksOutputTrack[] = [
        {
          city: 'cityValue',
          claims: null,
          country: 'countryValue',
          date: '19/02/2022',
          event: 'event1',
          platform: 'FranceConnect+',
          spAcr: 'eidas1',
          spName: 'spNameValue',
          trackId: 'xxzxzxzd4z5dz5',
        },
        {
          city: 'cityValue',
          claims: null,
          country: 'countryValue',
          date: '20/02/2022',
          event: 'event2',
          platform: 'FranceConnect+',
          spAcr: 'eidas2',
          spName: 'spNameValue',
          trackId: 'xxzxzxzd4z5dz5',
        },
        {
          city: 'cityValue',
          claims: null,
          country: 'countryValue',
          date: '23/02/2022',
          event: 'event3',
          platform: 'FranceConnect+',
          spAcr: 'eidas3',
          spName: 'spNameValue',
          trackId: 'xxzxzxzd4z5dz5',
        },
      ];
      const tracks = await service.formattedTracks(rawTracksMock);
      expect(tracks).toStrictEqual(tracksOutputMock);
    });
  });
});
