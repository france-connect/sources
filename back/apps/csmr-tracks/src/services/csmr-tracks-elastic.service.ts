import {
  Field,
  QueryDslFieldAndFormat,
  QueryDslQueryContainer,
  SearchRequest,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { IPaginationOptions } from '@fc/common';
import { ConfigService } from '@fc/config';
import {
  ElasticsearchConfig,
  formatMultiMatchGroup,
  formatV2Query,
} from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { EVENT_MAPPING, NOW, SIX_MONTHS_AGO } from '../constants';
import {
  ICsmrTracksData,
  ICsmrTracksElasticResults,
  Search,
} from '../interfaces';

export type SearchResponseTracks = SearchResponse<ICsmrTracksData>;

// Constants
const DEFAULT_OFFSET = 0;
const DEFAULT_SIZE = 10;

// Helper
export const buildQuery = ([legacy, event]: [
  string,
  string,
]): QueryDslQueryContainer => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [action, type_action] = legacy.split('/');
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const terms = [{ action, type_action }];
  const query = {
    bool: {
      should: [formatV2Query(event), formatMultiMatchGroup(terms, true)],
    },
  };
  return query;
};

@Injectable()
export class CsmrTracksElasticService {
  fields: (QueryDslFieldAndFormat | Field)[];
  eventsQuery: QueryDslQueryContainer;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly elasticsearch: ElasticsearchService,
  ) {}

  onModuleInit() {
    this.eventsQuery = this.createEventsQuery();
  }

  public async getTracks(
    groupIds: string[],
    options: IPaginationOptions,
  ): Promise<ICsmrTracksElasticResults> {
    const rawTracks = await this.getElasticLogs(groupIds, options);

    const { total, hits: payload } = rawTracks.hits;

    const { size, offset } = options;

    const results: ICsmrTracksElasticResults = {
      meta: {
        /**
         *  We forced in query, total must be a number.
         * @see { link:https://www.elastic.co/guide/en/elasticsearch/reference/current/search-search.html (rest_total_hits_as_int) }
         */
        total: total as number,
        size,
        offset,
      },
      payload,
    };

    return results;
  }

  private createEventsQuery(): QueryDslQueryContainer {
    const terms = Object.entries(EVENT_MAPPING).map((group) =>
      buildQuery(group),
    );

    const eventsQuery: QueryDslQueryContainer = {
      bool: {
        should: terms,
      },
    };
    return eventsQuery;
  }

  private async getElasticLogs(
    accountIds: string[],
    options = {} as IPaginationOptions,
  ): Promise<SearchResponseTracks> {
    const { offset = DEFAULT_OFFSET, size = DEFAULT_SIZE } = options;

    const { tracksIndex } =
      this.config.get<ElasticsearchConfig>('Elasticsearch');

    const dateQuery: QueryDslQueryContainer = {
      range: {
        time: {
          gte: SIX_MONTHS_AGO,
          lte: NOW,
        },
      },
    };

    const idsQuery: QueryDslQueryContainer = {
      terms: {
        accountId: accountIds,
      },
    };

    const query: Search = {
      // Elastic Search params
      // eslint-disable-next-line @typescript-eslint/naming-convention
      rest_total_hits_as_int: true,
      index: tracksIndex,
      from: offset,
      size,
      sort: [
        {
          time: {
            order: 'desc',
          },
        },
      ],
      query: {
        bool: {
          filter: [idsQuery, dateQuery, this.eventsQuery],
        },
      },
    };

    const response: SearchResponseTracks = await this.elasticsearch.search(
      query as unknown as SearchRequest,
    );

    return response;
  }
}
