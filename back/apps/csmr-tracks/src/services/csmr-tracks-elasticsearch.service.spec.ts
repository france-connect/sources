import { Search } from '@elastic/elasticsearch/api/requestParams';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import { ConfigService } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger-legacy';
import { IRichClaim } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CSMR_TRACKS_DATA } from '../tokens';
import { CsmrTracksElasticsearchService } from './csmr-tracks-elasticsearch.service';

const trackIndexMock = 'fc_tracks';

const elasticsearchConfigMock: ElasticsearchConfig = {
  tracksIndex: trackIndexMock,
  nodes: ['https://elasticsearch:9200'],
  username: 'docker-stack',
  password: 'docker-stack',
};

const accountIdMock = 'accountIdValue';

const elasticQueryMock: Search = {
  index: 'fc_tracks',
  body: {
    query: {
      match: {
        accountId: accountIdMock,
      },
    },
  },
};

const claims1: IRichClaim = {
  identifier: 'claims1',
  label: 'Claim1 Label',
  provider: {
    label: 'Data Provider 1',
    key: 'data_provider_1',
  },
};

const claims2: IRichClaim = {
  identifier: 'claims2',
  label: 'Claim2 Label',
  provider: {
    label: 'Data Provider 2',
    key: 'data_provider_2',
  },
};

const singleTrackMock: Omit<ICsmrTracksOutputTrack, 'trackId'> = {
  event: 'eventMockValue',
  time: 1441663200000,
  spLabel: 'spLabelMockValue',
  spAcr: 'spAcrMockValue',
  idpLabel: 'idpLabelMockValue',
  country: 'countryMockValue',
  city: 'cityMockValue',
  platform: 'platformValue',
  claims: [claims1, claims2],
};

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

const proxyDataMock = {
  formatQuery: jest.fn(),
  formattedTracks: jest.fn(),
};

describe('CsmrTracksElasticsearchService', () => {
  let service: CsmrTracksElasticsearchService;

  beforeEach(async () => {
    jest.restoreAllMocks();
    jest.resetAllMocks();

    const app: TestingModule = await Test.createTestingModule({
      controllers: [CsmrTracksElasticsearchService],
      providers: [
        ConfigService,
        LoggerService,
        ElasticsearchService,
        { provide: CSMR_TRACKS_DATA, useValue: proxyDataMock },
      ],
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTracksByAccountId()', () => {
    beforeEach(() => {
      configServiceMock.get.mockReturnValueOnce(elasticsearchConfigMock);

      elasticsearchServiceMock.search.mockResolvedValueOnce(
        elasticResponseMock,
      );

      proxyDataMock.formatQuery.mockReturnValueOnce(elasticQueryMock);
      proxyDataMock.formattedTracks.mockResolvedValueOnce(
        sampleTracksOutputMock,
      );
    });

    it('Should call the query proxy to get the query request', async () => {
      // Given / When
      await service.getTracksByAccountId(accountIdMock);
      // Then
      expect(proxyDataMock.formatQuery).toHaveBeenCalledTimes(1);
      expect(proxyDataMock.formatQuery).toHaveBeenCalledWith(
        elasticsearchConfigMock.tracksIndex,
        accountIdMock,
      );
    });

    it('Should call elasticsearch.search() method.', async () => {
      // Given / When
      await service.getTracksByAccountId(accountIdMock);
      // Then
      expect(elasticsearchServiceMock.search).toHaveBeenCalledTimes(1);
      expect(elasticsearchServiceMock.search).toHaveBeenCalledWith(
        elasticQueryMock,
      );
    });

    it('Should throw an exception if an error occured in elasticsearch.search().', async () => {
      // Given
      const errorMock = new Error('Unknown Error');

      elasticsearchServiceMock.search.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await expect(
        service.getTracksByAccountId(accountIdMock),
        // Then
      ).rejects.toThrow(errorMock);
    });

    it('Should format the tracks received from elasticsearch into a format `ICsmrTracksOutputTrack`', async () => {
      // Given / When
      await service.getTracksByAccountId(accountIdMock);
      // Then
      expect(proxyDataMock.formattedTracks).toHaveBeenCalledTimes(1);
      expect(proxyDataMock.formattedTracks).toHaveBeenCalledWith(
        elasticResponseMock.body.hits.hits,
      );
    });

    it('Should return an array of Tracks objects', async () => {
      // Given / When
      const result = await service.getTracksByAccountId(accountIdMock);
      // Then
      expect(result).toStrictEqual(sampleTracksOutputMock);
    });

    it('Should throw an exception if formatted tracks failed', async () => {
      // Given

      const errorMock = new Error('Unknown Error');
      proxyDataMock.formattedTracks.mockReset().mockImplementationOnce(() => {
        throw errorMock;
      });
      // When
      await expect(
        service.getTracksByAccountId(accountIdMock),
        // Then
      ).rejects.toThrow(errorMock);
    });
  });
});
