import { ApiResponse } from '@elastic/elasticsearch';
import { Search } from '@elastic/elasticsearch/api/requestParams';
import { pick } from 'lodash';

import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { ConfigService } from '@fc/config';
import { ElasticsearchConfig } from '@fc/elasticsearch';
import { LoggerService } from '@fc/logger';

import { ICsmrTracksInputTrack, ICsmrTracksOutputTrack } from '../interfaces';

/**
 * Array of available track's object attributes
 *used to validate the tracks received from Elasticsearch.
 * @see ICsmrTracksOutputTrack
 */
const TRACK_PROPERTIES = [
  'event',
  'date',
  'accountId',
  'spId',
  'spName',
  'spAcr',
  'country',
  'city',
];

/**
 * @see https://github.com/nestjs/elasticsearch
 */
@Injectable()
export class CsmrTracksElasticsearchService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly elasticsearch: ElasticsearchService,
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
    let response: ApiResponse;
    const { tracksIndex } =
      this.config.get<ElasticsearchConfig>('Elasticsearch');

    const query: Search = {
      index: tracksIndex,
      body: {
        query: {
          match: {
            accountId,
          },
        },
      },
    };

    try {
      response = await this.elasticsearch.search(query);
    } catch (error) {
      this.logger.trace({ error });
      return [];
    }

    const rawTracks = response.body.hits.hits as ICsmrTracksInputTrack[];
    const tracks = this.getFormatedTracks(rawTracks);
    return tracks;
  }

  /**
   * Get formated tracks reduces to its strickselements.
   * Elasticsearch add extra attributes to the stored data that are not requiered.
   *
   * @param {ICsmrTracksInputTrack[]} rawTracks
   * @returns {ICsmrTracksOutputTrack[]}
   */
  private getFormatedTracks(
    rawTracks: ICsmrTracksInputTrack[],
  ): ICsmrTracksOutputTrack[] {
    const filteredProperties = rawTracks.map((track) => {
      const trackId = track._id;
      const source = track._source;
      const properties = pick(source, TRACK_PROPERTIES);
      return { ...properties, trackId };
    }) as ICsmrTracksOutputTrack[];
    return filteredProperties;
  }
}
