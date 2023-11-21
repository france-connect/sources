import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Test, TestingModule } from '@nestjs/testing';

import { IPaginationOptions } from '@fc/common';
import { ConfigService } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger-legacy';

import {
  ICsmrTracksData,
  ICsmrTracksElasticResults,
  Search,
} from '../interfaces';
import * as helper from './csmr-tracks-elastic.service';
import { CsmrTracksElasticService } from './csmr-tracks-elastic.service';

jest.mock('../constants', () => ({
  FIELDS_FCP_HIGH: ['fieldHighValue1', 'fieldHighValue2'],
  FIELDS_FC_LEGACY: ['fieldLegacyValue1', 'fieldLegacyValue2'],
  EVENT_MAPPING: {
    'action1/typeAction1': 'eventValue1',
    'action2/typeAction2': 'eventValue2',
  },
  NOW: 'nowValue',
  SIX_MONTHS_AGO: 'sixMonthAgoValue',
}));

describe('buildQuery()', () => {
  it('should build ES terms based on event and action data', () => {
    const data: [string, string] = [
      'actionValue/typeActionValue',
      'eventValue1',
    ];
    const resultMock = {
      bool: {
        should: [
          {
            term: {
              event: 'eventValue1',
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
    const result = helper.buildQuery(data);

    expect(result).toStrictEqual(resultMock);
  });
});

describe('CsmrTracksElasticService', () => {
  let service: CsmrTracksElasticService;

  const loggerMock = {
    debug: jest.fn(),
    trace: jest.fn(),
    setContext: jest.fn(),
  };

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
        CsmrTracksElasticService,
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

    service = module.get<CsmrTracksElasticService>(CsmrTracksElasticService);
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

  describe('getTracks()', () => {
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
      await service.getTracks(idsMock, optionsMock);
      // Then
      expect(service['getElasticLogs']).toHaveBeenCalledTimes(1);
      expect(service['getElasticLogs']).toHaveBeenCalledWith(
        idsMock,
        optionsMock,
      );
    });

    it('should return ElasticSearch Search', async () => {
      // Given
      const resultMock: ICsmrTracksElasticResults = {
        meta: { offset: 12, size: 42, total: totalMock },
        payload: dataMock as unknown as SearchHit<ICsmrTracksData>[],
      };
      // When
      const result = await service.getTracks(idsMock, optionsMock);
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

    const searchMock: Partial<helper.SearchResponseTracks> = {
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

    const queryMock: Search = {
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
      await service['getElasticLogs'](accountIdMock, {} as IPaginationOptions);

      // Then
      expect(elasticMock.search).toHaveBeenCalledTimes(1);
      expect(elasticMock.search).toHaveBeenCalledWith(query);
    });

    it('should get tracks from ElasticSearch service even without defined options', async () => {
      // Given
      const query = {
        ...queryMock,
        from: 0,
        size: 10,
      };

      // When
      await service['getElasticLogs'](
        accountIdMock,
        undefined as IPaginationOptions,
      );

      // Then
      expect(elasticMock.search).toHaveBeenCalledTimes(1);
      expect(elasticMock.search).toHaveBeenCalledWith(query);
    });
  });
});
