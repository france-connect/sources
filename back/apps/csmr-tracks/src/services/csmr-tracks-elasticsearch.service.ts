import { ApiResponse } from '@elastic/elasticsearch';

import { Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { ConfigService } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { IAppTracksDataService, ICsmrTracksElasticInput } from '../interfaces';
import { CSMR_TRACKS_DATA } from '../tokens';

/**
 * @see https://github.com/nestjs/elasticsearch
 */
@Injectable()
export class CsmrTracksElasticsearchService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly elasticsearch: ElasticsearchService,
    @Inject(CSMR_TRACKS_DATA)
    private readonly dataProxy: IAppTracksDataService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Get the array of traces for a specific `accountId`.
   *
   * @see http://localhost:9200/fc_tracks/_search?pretty
   * @param {string} spId Service Provider ID
   * @returns {Promise<ICsmrTracksOutputTrack[]>}
   */
  async getTracksByAccountId(
    accountId: string,
  ): Promise<ICsmrTracksOutputTrack[]> {
    this.logger.trace({ accountId });

    const { tracksIndex } =
      this.config.get<ElasticsearchConfig>('Elasticsearch');

    const query = this.dataProxy.formatQuery(tracksIndex, accountId);

    const response: ApiResponse = await this.elasticsearch.search(query);

    const rawTracks = response.body.hits
      .hits as ICsmrTracksElasticInput<unknown>[];

    const tracks = await this.dataProxy.formattedTracks(rawTracks);

    this.logger.trace({ tracks });

    return tracks;
  }
}
