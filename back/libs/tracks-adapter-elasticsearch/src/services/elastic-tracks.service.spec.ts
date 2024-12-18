import {
  SearchHit,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ElasticsearchConfig,
  formatMultiMatchGroup,
  formatV2Query,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { getLoggerMock } from '@mocks/logger';

import {
  ElasticTracksResultsInterface,
  ElasticTracksType,
  SearchType,
} from '../interfaces';
import * as helper from './elastic-tracks.service';
import { ElasticTracksService } from './elastic-tracks.service';

jest.mock('@fc/elasticsearch');

jest.mock('../constants', () => ({
  FIELDS_FCP_HIGH: ['fieldHighValue1', 'fieldHighValue2'],
  FIELDS_FC_LEGACY: ['fieldLegacyValue1', 'fieldLegacyValue2'],
  EVENT_MAPPING: {
    'action1/typeAction1': 'eventValue1',
    'action2/typeAction2': 'eventValue2',
  },
  NOW: 'nowValue',
  SIX_MONTHS_AGO: 'sixMonthAgoValue',
  DEFAULT_OFFSET: 0,
  DEFAULT_SIZE: 10,
}));

describe('buildQuery()', () => {
  it('should build ES terms based on event and action data', () => {
    // Given
    const formatV2QueryResponse = {
      bool: {
        must: [
          {
            term: {
              event: 'eventValue1',
            },
          },
        ],
      },
    };
    const formatV2QueryMock = jest.mocked(formatV2Query);
    formatV2QueryMock.mockReturnValue(formatV2QueryResponse);

    const formatMultiMatchGroupResponse = {
      bool: {
        must: [
          {
            bool: {
              must: [
                {
                  term: {
                    action: 'actionValue',
                  },
                },
                {
                  term: {
                    // Legacy Tracks Params
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    type_action: 'typeActionValue',
                  },
                },
              ],
            },
          },
        ],
      },
    };
    const formatMultiMatchGroupMock = jest.mocked(formatMultiMatchGroup);
    formatMultiMatchGroupMock.mockReturnValue(formatMultiMatchGroupResponse);

    const data: [string, string] = [
      'actionValue/typeActionValue',
      'eventValue1',
    ];
    const resultMock = {
      bool: {
        should: [
          {
            bool: {
              must: [
                {
                  term: {
                    event: 'eventValue1',
                  },
                },
              ],
            },
          },
          {
            bool: {
              must: [
                {
                  bool: {
                    must: [
                      {
                        term: {
                          action: 'actionValue',
                        },
                      },
                      {
                        term: {
                          // Legacy Tracks Params
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          type_action: 'typeActionValue',
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };

    // When
    const result = helper.buildQuery(data);

    // Then
    expect(result).toStrictEqual(resultMock);
  });
});

describe('ElasticTracksService', () => {
  let service: ElasticTracksService;

  const loggerMock = getLoggerMock();

  const configMock = {
    get: jest.fn(),
  };

  const elasticMock = {
    search: jest.fn(),
  };

  const optionsMock: IPaginationOptions = {
    size: 42,
    offset: 12,
  };

  beforeEach(async () => {
    jest.resetAllMocks();
    jest.restoreAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ElasticTracksService,
        ElasticsearchService,
        LoggerService,
        ConfigService,
      ],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerMock)
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
    const queryMock = {
      bool: {
        should: ['test'],
      },
    };

    beforeEach(() => {
      service['createEventsQuery'] = jest.fn().mockReturnValueOnce(queryMock);
    });

    it('should create event query params for ES query', () => {
      // When
      service.onModuleInit();
      // Then
      expect(service['createEventsQuery']).toHaveBeenCalledTimes(1);
      expect(service['createEventsQuery']).toHaveBeenCalledWith();
      expect(service.eventsQuery).toStrictEqual(queryMock);
    });
  });

  describe('getElasticTracks()', () => {
    const idsMock = ['idValue1', 'idValue2', 'idValue3'];
    const dataMock = Symbol('data');
    const totalMock = 42;
    const elasticMock = {
      hits: {
        total: totalMock,
        hits: dataMock,
      },
    };

    beforeEach(() => {
      service['getElasticLogs'] = jest.fn().mockResolvedValueOnce(elasticMock);
    });

    it('should call getElasticLogs()', async () => {
      // When
      await service.getElasticTracks(idsMock, optionsMock);
      // Then
      expect(service['getElasticLogs']).toHaveBeenCalledTimes(1);
      expect(service['getElasticLogs']).toHaveBeenCalledWith(
        idsMock,
        optionsMock,
      );
    });

    it('should return ElasticSearch Search', async () => {
      // Given
      const resultMock: ElasticTracksResultsInterface = {
        total: totalMock,
        payload: dataMock as unknown as SearchHit<ElasticTracksType>[],
      };
      // When
      const result = await service.getElasticTracks(idsMock, optionsMock);
      // Then
      expect(result).toStrictEqual(resultMock);
    });
  });

  describe('createEventsQuery()', () => {
    let helperMock;

    beforeEach(() => {
      helperMock = jest.spyOn(helper, 'buildQuery');
      helperMock
        .mockReturnValueOnce(['terms1'])
        .mockReturnValueOnce(['terms2']);
    });

    it('should return event terms for ES query', () => {
      // Given
      const resultMock = {
        bool: {
          should: [['terms1'], ['terms2']],
        },
      };
      // When
      const result = service['createEventsQuery']();
      // Then
      expect(result).toStrictEqual(resultMock);
    });

    it('should use buildQuery helper to create terms query', () => {
      // When
      service['createEventsQuery']();
      // Then
      expect(helperMock).toHaveBeenCalledTimes(2);
      expect(helperMock).toHaveBeenNthCalledWith(1, [
        'action1/typeAction1',
        'eventValue1',
      ]);
      expect(helperMock).toHaveBeenNthCalledWith(2, [
        'action2/typeAction2',
        'eventValue2',
      ]);
    });
  });

  describe('getElasticLogs()', () => {
    const accountIdMock = ['idValue1', 'idValue2'];
    const configDataMock: Partial<ElasticsearchConfig> = {
      tracksIndex: 'indexValue',
    };

    const fieldsMock = {
      name: 'nameValue',
      fiId: 'fiIdValue',
      fiSub: 'fiSubValue',
      fsId: 'fsIdValue',
      fsSub: 'fsSubValue',
      accountId: 'accountIdValue',
      scopes: 'scopesValue',
      userIp: 'userIpValue',
      action: 'actionValue',
      // Legacy param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      type_action: 'typeActionValue',
      fi: 'fiValue',
      // Legacy param name
      // eslint-disable-next-line @typescript-eslint/naming-convention
      fs_label: 'fsLabelValue',
      eidas: 'eidasValue',
      time: 'timeValue',
      service: 'serviceValue',
    };

    const eventsQueryMock = {
      bool: {
        must: [
          {
            term: {
              event: 'termEventValue',
            },
          },
        ],
      },
    };

    const searchMock: SearchResponse<ElasticTracksType> = {
      hits: {
        hits: [
          {
            _index: 'indexValue',
            _id: 'idValue',
            fields: fieldsMock,
          },
        ],
      },
      took: 42,
      // ES standard object
      // eslint-disable-next-line @typescript-eslint/naming-convention
      timed_out: false,
      _shards: null,
    };

    const queryMock: SearchType = {
      query: {
        bool: {
          filter: [
            { terms: { accountId: ['idValue1', 'idValue2'] } },
            {
              range: { time: { gte: 'sixMonthAgoValue', lte: 'nowValue' } },
            },
            eventsQueryMock,
          ],
        },
      },
      sort: [{ time: { order: 'desc' } }],

      index: 'indexValue',
      // Elastic Search params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rest_total_hits_as_int: true,
    };

    beforeEach(() => {
      configMock.get.mockReturnValueOnce(configDataMock);

      elasticMock.search.mockResolvedValueOnce(searchMock);

      service.fields = ['field1', 'field2'];
      service.eventsQuery = eventsQueryMock;
    });

    it('should get index from config', async () => {
      // When
      await service['getElasticLogs'](accountIdMock, optionsMock);
      // Then
      expect(configMock.get).toHaveBeenCalledTimes(1);
      expect(configMock.get).toHaveBeenCalledWith('Elasticsearch');
    });

    it('should search tracks with a specific account ids and specific pagination', async () => {
      // Given
      const query = {
        ...queryMock,
        from: 12,
        size: 42,
      };
      // When
      await service['getElasticLogs'](accountIdMock, optionsMock);

      // Then
      expect(elasticMock.search).toHaveBeenCalledTimes(1);
      expect(elasticMock.search).toHaveBeenCalledWith(query);
    });

    it('should get tracks from ElasticSearch service', async () => {
      // When
      const result = await service['getElasticLogs'](
        accountIdMock,
        optionsMock,
      );

      // Then
      expect(result).toStrictEqual(searchMock);
    });

    it('should get tracks from ElasticSearch service based on default options', async () => {
      // Given
      const query = {
        ...queryMock,
        from: 0,
        size: 10,
      };

      // When
      await service['getElasticLogs'](accountIdMock);

      // Then
      expect(elasticMock.search).toHaveBeenCalledTimes(1);
      expect(elasticMock.search).toHaveBeenCalledWith(query);
    });
  });
});
