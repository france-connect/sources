import {
  QueryDslQueryContainer,
  SearchHit,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ElasticQueryOptionsInterface,
  ElasticsearchConfig,
} from '@fc/elasticsearch';

import {
  ElasticTracksResultsInterface,
  ElasticTracksType,
  SearchType,
} from '../interfaces';
import { buildEventQuery } from '../utils';
import { ElasticTracksService } from './elastic-tracks.service';

jest.mock('../utils');
jest.mock('@fc/elasticsearch/constants', () => ({
  NOW: 'nowValue',
  SIX_MONTHS_AGO: 'sixMonthAgoValue',
  DEFAULT_OFFSET: 0,
  DEFAULT_SIZE: 10,
  DEFAULT_ORDER: 'desc',
}));
jest.mock('../constants', () => ({
  EVENT_MAPPING: {
    'authentication/initial': 'FC_VERIFIED',
    'consent/demandeIdentity': 'FC_DATATRANSFER_CONSENT_IDENTITY',
  },
}));

describe('ElasticTracksService', () => {
  let service: ElasticTracksService;

  const configMock = {
    get: jest.fn(),
  };

  const elasticMock = {
    search: jest.fn(),
  };

  const elasticQueryOptionsMock: ElasticQueryOptionsInterface = {
    size: 42,
    offset: 12,
    order: 'asc',
  };

  const event1TermsMock = Symbol(
    'eventTerms1Mock',
  ) as unknown as QueryDslQueryContainer;

  const event2TermsMock = Symbol(
    'eventTerms2Mock',
  ) as unknown as QueryDslQueryContainer;

  const eventsTermsMock = {
    'authentication/initial': event1TermsMock,
    'consent/demandeIdentity': event2TermsMock,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ElasticTracksService, ElasticsearchService, ConfigService],
    })
      .overrideProvider(ConfigService)
      .useValue(configMock)
      .overrideProvider(ElasticsearchService)
      .useValue(elasticMock)
      .compile();

    service = module.get<ElasticTracksService>(ElasticTracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit()', () => {
    beforeEach(() => {
      service['computeEventsTerms'] = jest
        .fn()
        .mockReturnValueOnce(eventsTermsMock);
    });

    it('should compute events terms params for ES query', () => {
      // When
      service.onModuleInit();

      // Then
      expect(service['computeEventsTerms']).toHaveBeenCalledTimes(1);
      expect(service['computeEventsTerms']).toHaveBeenCalledWith();
      expect(service.eventsTerms).toStrictEqual(eventsTermsMock);
    });
  });

  describe('computeEventsTerms()', () => {
    beforeEach(() => {
      jest
        .mocked(buildEventQuery)
        .mockReturnValueOnce(event1TermsMock)
        .mockReturnValueOnce(event2TermsMock);
    });

    it('should return eventTerms', () => {
      // When
      const result = service['computeEventsTerms']();

      // Then
      expect(result).toStrictEqual(eventsTermsMock);
    });

    it('should use buildEventQuery to create terms query', () => {
      // When
      service['computeEventsTerms']();

      // Then
      expect(buildEventQuery).toHaveBeenCalledTimes(2);
      expect(buildEventQuery).toHaveBeenNthCalledWith(1, [
        'authentication/initial',
        'FC_VERIFIED',
      ]);
      expect(buildEventQuery).toHaveBeenNthCalledWith(2, [
        'consent/demandeIdentity',
        'FC_DATATRANSFER_CONSENT_IDENTITY',
      ]);
    });
  });

  describe('getElasticTracksForAccountIds()', () => {
    const idsMock = ['idValue1', 'idValue2', 'idValue3'];
    const paginationOptionsMock: IPaginationOptions = {
      size: 42,
      offset: 12,
    };
    const payloadMock = Symbol('payload');
    const totalMock = 42;
    const elasticMock = {
      hits: {
        total: totalMock,
        hits: payloadMock,
      },
    };
    const eventsFilterMock = {
      bool: {
        should: [event1TermsMock, event2TermsMock],
      },
    };
    const accountIdsFilterMock = {
      terms: { accountId: ['idValue1', 'idValue2', 'idValue3'] },
    };

    beforeEach(() => {
      service['getElasticLogs'] = jest.fn().mockResolvedValue(elasticMock);
      service['eventsTerms'] = eventsTermsMock;
    });

    it('should call getElasticLogs()', async () => {
      // When
      await service.getElasticTracksForAccountIds(
        idsMock,
        paginationOptionsMock,
      );

      // Then
      expect(service['getElasticLogs']).toHaveBeenCalledTimes(1);
      expect(service['getElasticLogs']).toHaveBeenCalledWith(
        [accountIdsFilterMock, eventsFilterMock],
        paginationOptionsMock,
      );
    });

    it('should return ElasticSearch Search', async () => {
      // Given
      const resultMock: ElasticTracksResultsInterface = {
        total: totalMock,
        payload: payloadMock as unknown as SearchHit<ElasticTracksType>[],
      };

      // When
      const result = await service.getElasticTracksForAccountIds(
        idsMock,
        paginationOptionsMock,
      );

      // Then
      expect(result).toStrictEqual(resultMock);
    });
  });

  describe('getElasticTracksForAuthenticationEventId()', () => {
    const authenticationEventIdMock = 'idValue1';
    const queryOptionsMock: ElasticQueryOptionsInterface = {
      order: 'asc',
    };
    const payloadMock = Symbol('payload');
    const totalMock = 42;
    const elasticMock = {
      hits: {
        total: totalMock,
        hits: payloadMock,
      },
    };

    const eventsFilterMock = {
      bool: {
        should: event1TermsMock,
      },
    };

    const authenticationEventIdFilterMock = {
      bool: {
        should: [
          {
            term: {
              browsingSessionId: authenticationEventIdMock,
            },
          },
          {
            term: {
              cinematicID: authenticationEventIdMock,
            },
          },
        ],
      },
    };

    beforeEach(() => {
      service['getElasticLogs'] = jest.fn().mockResolvedValue(elasticMock);
      service['eventsTerms'] = eventsTermsMock;
    });

    it('should call getElasticLogs()', async () => {
      // When
      await service.getElasticTracksForAuthenticationEventId(
        authenticationEventIdMock,
      );

      // Then
      expect(service['getElasticLogs']).toHaveBeenCalledTimes(1);
      expect(service['getElasticLogs']).toHaveBeenCalledWith(
        [authenticationEventIdFilterMock, eventsFilterMock],
        queryOptionsMock,
      );
    });

    it('should return ElasticSearch Search', async () => {
      // Given
      const resultMock: ElasticTracksResultsInterface = {
        total: totalMock,
        payload: payloadMock as unknown as SearchHit<ElasticTracksType>[],
      };

      // When
      const result = await service.getElasticTracksForAuthenticationEventId(
        authenticationEventIdMock,
      );

      // Then
      expect(result).toStrictEqual(resultMock);
    });
  });

  describe('getElasticLogs()', () => {
    const configDataMock: Partial<ElasticsearchConfig> = {
      index: 'indexValue',
    };

    const dateQueryMock: QueryDslQueryContainer = {
      range: { time: { gte: 'sixMonthAgoValue', lte: 'nowValue' } },
    };

    const filterMock = Symbol(
      'filtersMock',
    ) as unknown as QueryDslQueryContainer;

    const searchResultsMock = Symbol(
      'searchResultsMock',
    ) as unknown as SearchResponse<ElasticTracksType>;

    const partialQueryMock = {
      query: {
        bool: {
          filter: [filterMock, dateQueryMock],
        },
      },
      index: 'indexValue',
      // Elastic Search params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rest_total_hits_as_int: true,
    };

    beforeEach(() => {
      configMock.get.mockReturnValue(configDataMock);
      elasticMock.search.mockResolvedValue(searchResultsMock);
    });

    it('should get index from config', async () => {
      // When
      await service['getElasticLogs']([filterMock], elasticQueryOptionsMock);

      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('Elasticsearch');
    });

    it('should call elasticsearch.search with filters and options', async () => {
      // Given
      const query: SearchType = {
        ...partialQueryMock,
        sort: [{ time: { order: 'asc' } }],
        from: 12,
        size: 42,
      };

      // When
      await service['getElasticLogs']([filterMock], elasticQueryOptionsMock);

      // Then
      expect(elasticMock.search).toHaveBeenCalledTimes(1);
      expect(elasticMock.search).toHaveBeenCalledWith(query);
    });

    it('should call elasticsearch.search based on default options', async () => {
      // Given
      const query = {
        ...partialQueryMock,
        sort: [{ time: { order: 'desc' } }],
        from: 0,
        size: 10,
      };

      // When
      await service['getElasticLogs']([filterMock]);

      // Then
      expect(elasticMock.search).toHaveBeenCalledTimes(1);
      expect(elasticMock.search).toHaveBeenCalledWith(query);
    });

    it('should return search results', async () => {
      // When
      const result = await service['getElasticLogs'](
        [filterMock],
        elasticQueryOptionsMock,
      );

      // Then
      expect(result).toStrictEqual(searchResultsMock);
    });
  });
});
