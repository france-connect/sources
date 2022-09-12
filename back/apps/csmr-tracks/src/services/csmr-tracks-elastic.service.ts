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
import { ElasticsearchConfig, formatMultiMatchGroup } from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger-legacy';

import {
  EVENT_MAPPING,
  FIELDS_FC_LEGACY,
  FIELDS_FCP_HIGH,
  NOW,
  SIX_MONTHS_AGO,
} from '../constants';
import {
  ICsmrTracksElasticResults,
  ICsmrTracksFieldsRawData,
  Search,
} from '../interfaces';

export type SearchResponseTracks = SearchResponse<ICsmrTracksFieldsRawData>;

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
      should: [{ term: { event } }, formatMultiMatchGroup(terms, true)],
    },
  };
  return query;
};

@Injectable()
export class CsmrTracksElasticService {
  fields: (QueryDslFieldAndFormat | Field)[];
  eventsQuery: QueryDslQueryContainer;

  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly elasticsearch: ElasticsearchService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  onModuleInit() {
    /**
     * @todo add ES logs during development
     * We need "isDevelopment" from app Config
     *
     * Author: Arnaud PSA
     * Date: 13/06/22
     *
      this.elasticsearch.on('request', (...events) => {
        console.log(util.inspect(events, true, 50, true));
      });
      this.elasticsearch.on('response', (...events) => {
        this.logger.trace({ events });
      });
      this.elasticsearch.on('sniff', (...events) => {
        this.logger.trace({ events });
      });
     */

    this.fields = this.getFields();
    this.eventsQuery = this.createEventsQuery();
  }

  public async getTracks(
    groupIds: string[],
    options: IPaginationOptions,
  ): Promise<ICsmrTracksElasticResults> {
    this.logger.trace({ groupIds });

    const rawTracks = await this.getElasticLogs(groupIds, options);

    const { total, hits: payload } = rawTracks.hits;

    this.logger.trace({ payload });

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

  private getFields(): (QueryDslFieldAndFormat | Field)[] {
    const globalFields = [
      'source.geo.city_name',
      'source.geo.country_iso_code',
      'source.geo.region_name',
    ];

    const sortableFields = [{ field: 'time', format: 'epoch_millis' }];
    const fields = [
      ...new Set([
        ...globalFields,
        ...(FIELDS_FCP_HIGH as string[]),
        ...(FIELDS_FC_LEGACY as string[]),
        ...sortableFields,
      ]),
    ];

    return fields;
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
      fields: this.fields,
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

    this.logger.trace({ query });

    const response: SearchResponseTracks = await this.elasticsearch.search(
      query as unknown as SearchRequest,
    );

    this.logger.trace({ response });

    return response;
  }
}
