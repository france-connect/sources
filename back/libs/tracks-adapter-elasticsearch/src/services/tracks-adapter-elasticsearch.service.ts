import { Injectable } from '@nestjs/common';

import { IPaginationOptions } from '@fc/common';

import {
  TracksAdapterResultsInterface,
  TracksFormatterOutputAbstract,
} from '../interfaces';
import { ElasticTracksService } from './elastic-tracks.service';
import { TracksFormatterService } from './tracks-formatter.service';

@Injectable()
export class TracksAdapterElasticsearchService<
  TOutput extends TracksFormatterOutputAbstract,
> {
  constructor(
    private readonly elastic: ElasticTracksService,
    private readonly formatter: TracksFormatterService<TOutput>,
  ) {}

  public async getTracksForAccountIds(
    accountIds: string[],
    options: IPaginationOptions,
  ): Promise<TracksAdapterResultsInterface<TOutput>> {
    const { total, payload: elasticTracks } =
      await this.elastic.getElasticTracksForAccountIds(accountIds, options);

    const formattedTracks = this.formatter.formatTracks(elasticTracks);

    const results: TracksAdapterResultsInterface<TOutput> = {
      total,
      payload: formattedTracks,
    };

    return results;
  }

  public async getTracksForAuthenticationEventId(
    authenticationEventId: string,
  ): Promise<TracksAdapterResultsInterface<TOutput>> {
    const { total, payload: elasticTracks } =
      await this.elastic.getElasticTracksForAuthenticationEventId(
        authenticationEventId,
      );

    const formattedTracks = this.formatter.formatTracks(elasticTracks);

    const results: TracksAdapterResultsInterface<TOutput> = {
      total,
      payload: formattedTracks,
    };

    return results;
  }
}
