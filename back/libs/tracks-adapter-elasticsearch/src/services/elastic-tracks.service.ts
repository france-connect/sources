import {
  QueryDslQueryContainer,
  SearchRequest,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { IPaginationOptions } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  DEFAULT_OFFSET,
  DEFAULT_ORDER,
  DEFAULT_SIZE,
  ElasticQueryOptionsInterface,
  ElasticsearchConfig,
  NOW,
  SIX_MONTHS_AGO,
} from '@fc/elasticsearch';

import { EVENT_MAPPING } from '../constants';
import {
  ElasticTracksResultsInterface,
  ElasticTracksType,
  SearchType,
} from '../interfaces';
import { buildEventQuery } from '../utils';

@Injectable()
export class ElasticTracksService {
  eventsTerms: { [key: string]: QueryDslQueryContainer };

  constructor(
    private readonly config: ConfigService,
    private readonly elasticsearch: ElasticsearchService,
  ) {}

  onModuleInit() {
    this.eventsTerms = this.computeEventsTerms();
  }

  private computeEventsTerms(): { [key: string]: QueryDslQueryContainer } {
    return Object.fromEntries(
      Object.entries(EVENT_MAPPING).map(([key, event]) => [
        key,
        buildEventQuery([key, event]),
      ]),
    );
  }

  public async getElasticTracksForAccountIds(
    accountIds: string[],
    options: IPaginationOptions,
  ): Promise<ElasticTracksResultsInterface> {
    const eventsFilter: QueryDslQueryContainer = {
      bool: {
        should: Object.values(this.eventsTerms),
      },
    };

    const accountIdsFilter: QueryDslQueryContainer = {
      terms: {
        accountId: accountIds,
      },
    };

    const filters = [accountIdsFilter, eventsFilter];

    const queryOptions: ElasticQueryOptionsInterface = {
      ...options,
    };

    const rawTracks = await this.getElasticLogs(filters, queryOptions);

    const { total, hits: payload } = rawTracks.hits;

    const results: ElasticTracksResultsInterface = {
      // total must be a number (https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)
      total: total as number,
      payload,
    };

    return results;
  }

  public async getElasticTracksForAuthenticationEventId(
    authenticationEventId: string,
  ): Promise<ElasticTracksResultsInterface> {
    const eventsFilter: QueryDslQueryContainer = {
      bool: {
        should: this.eventsTerms['authentication/initial'],
      },
    };

    const authenticationEventIdFilter: QueryDslQueryContainer = {
      bool: {
        should: [
          {
            term: {
              browsingSessionId: authenticationEventId,
            },
          },
          {
            term: {
              cinematicID: authenticationEventId,
            },
          },
        ],
      },
    };

    const filters = [authenticationEventIdFilter, eventsFilter];

    const queryOptions: ElasticQueryOptionsInterface = {
      order: 'asc',
    };

    const rawTracks = await this.getElasticLogs(filters, queryOptions);

    const { total, hits: payload } = rawTracks.hits;

    const results: ElasticTracksResultsInterface = {
      // total must be a number (https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html)
      total: total as number,
      payload,
    };

    return results;
  }

  /**
   * @todo FC-2184 ⚠️
   */
  // eslint-disable-next-line complexity
  private async getElasticLogs(
    filters: QueryDslQueryContainer[],
    options = {} as ElasticQueryOptionsInterface,
  ): Promise<SearchResponse<ElasticTracksType>> {
    const {
      offset = DEFAULT_OFFSET,
      size = DEFAULT_SIZE,
      order = DEFAULT_ORDER,
    } = options;

    const dateQuery: QueryDslQueryContainer = {
      range: {
        time: {
          gte: SIX_MONTHS_AGO,
          lte: NOW,
        },
      },
    };

    const { index } = this.config.get<ElasticsearchConfig>('Elasticsearch');

    const query: SearchType = {
      // Elastic Search params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rest_total_hits_as_int: true,
      index,
      from: offset,
      size,
      sort: [
        {
          time: {
            order,
          },
        },
      ],
      query: {
        bool: {
          filter: [...filters, dateQuery],
        },
      },
    };

    const response: SearchResponse<ElasticTracksType> =
      await this.elasticsearch.search(query as unknown as SearchRequest);

    return response;
  }
}
