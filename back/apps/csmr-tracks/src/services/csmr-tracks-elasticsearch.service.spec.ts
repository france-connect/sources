import { Search } from '@elastic/elasticsearch/api/requestParams';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { ICsmrTracksInputTrack, ICsmrTracksOutputTrack } from '../interfaces';
import { CsmrTracksElasticsearchService } from './csmr-tracks-elasticsearch.service';

const trackIndexMock = 'fc_tracks';

const elasticsearchConfigMock: ElasticsearchConfig = {
  tracksIndex: trackIndexMock,
  protocol: 'http',
  host: 'elasticsearch',
  port: 9200,
};

const accountId = '42';

const elasticQueryMock: Search = {
  index: 'fc_tracks',
  body: {
    query: {
      match: {
        accountId,
      },
    },
  },
};

const singleTrackMock = {
  event: 'eventMockValue',
  date: 'dateMockValue',
  accountId: 'accountIdValue',
  spId: 'spIdMockValue',
  spName: 'spNameMockValue',
  spAcr: 'spAcrMockValue',
  country: 'countryMockValue',
  city: 'cityMockValue',
};

const sampleTracksInputMock: ICsmrTracksInputTrack[] = [
  {
    _index: 'fc_tracks',
    _type: '_doc',
    _id: 'any-unique-track-index-identifier-string-from-ES',
    _score: 1.0,
    extraAttribute: '!!!!!!!!!!!!',
    _source: {
      ...singleTrackMock,
      extraValue: '==============',
      otherExtraValue: '---------',
    },
  } as ICsmrTracksInputTrack,
];

const sampleTracksOutputMock: ICsmrTracksOutputTrack[] = [
  {
    ...singleTrackMock,
    trackId: 'any-unique-track-index-identifier-string-from-ES',
  },
];

const configServiceMock = {
  get: jest.fn(),
};

const elasticResponseMock = {
  body: {
    hits: {
      hits: [{ ...singleTrackMock }],
      total: {
        value: 1,
      },
    },
  },
};

const loggerServiceMock = {
  setContext: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
} as unknown as LoggerService;

const elasticsearchServiceMock = {
  search: jest.fn(),
};

describe('CsmrTracksElasticsearchService', () => {
  let service: CsmrTracksElasticsearchService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksElasticsearchService],
      providers: [ConfigService, LoggerService, ElasticsearchService],
    })
      .overrideProvider(ConfigService)
      .useValue(configServiceMock)
      .overrideProvider(LoggerService)
      .useValue(loggerServiceMock)
      .overrideProvider(ElasticsearchService)
      .useValue(elasticsearchServiceMock)
      .compile();

    service = app.get<CsmrTracksElasticsearchService>(
      CsmrTracksElasticsearchService,
    );
  });

  describe('getTracksByAccountId()', () => {
    beforeEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();

      configServiceMock.get.mockReturnValueOnce(elasticsearchConfigMock);

      elasticsearchServiceMock.search.mockResolvedValueOnce(
        elasticResponseMock,
      );

      service['getFormatedTracks'] = jest
        .fn()
        .mockResolvedValueOnce(sampleTracksOutputMock);
    });

    it('Should call elasticsearch.search() method.', async () => {
      // Given / When
      await service.getTracksByAccountId(accountId);
      // Then
      expect(elasticsearchServiceMock.search).toHaveBeenCalledWith(
        elasticQueryMock,
      );
    });

    it('Should return an empty array if an error occured in elasticsearch.search().', async () => {
      // Given
      jest.resetAllMocks();
      jest.restoreAllMocks();

      configServiceMock.get.mockReturnValueOnce(elasticsearchConfigMock);

      elasticsearchServiceMock.search.mockImplementationOnce(() => {
        throw new Error();
      });
      // When
      const result = await service.getTracksByAccountId(accountId);
      // Then
      expect(result).toEqual([]);
    });

    it('Should format the tracks received from elasticsearch into a format `ICsmrTracksOutputTrack`', async () => {
      // Given / When
      await service.getTracksByAccountId(accountId);
      // Then
      expect(service['getFormatedTracks']).toHaveBeenCalledWith(
        elasticResponseMock.body.hits.hits,
      );
    });

    it('Should return an array of Tracks objects', async () => {
      // Given / When
      const result = await service.getTracksByAccountId(accountId);
      // Then
      expect(result).toEqual(sampleTracksOutputMock);
    });

    it('Should return an empty array [] if no tracks have been found for this account', async () => {
      // Given
      elasticsearchServiceMock.search.mockImplementationOnce(() => {
        throw new Error();
      });
      // When
      const result = await service.getTracksByAccountId(accountId);
      // Then
      expect(result).toEqual(sampleTracksOutputMock);
    });
  });

  describe('getFormatedTracks()', () => {
    it('Should format the data from Elasticsearch format into `ICsmrTracksOutputTrack` format', () => {
      // When
      const formatedData = service['getFormatedTracks'](sampleTracksInputMock);
      // Then
      expect(formatedData).toEqual(sampleTracksOutputMock);
    });
  });
});
