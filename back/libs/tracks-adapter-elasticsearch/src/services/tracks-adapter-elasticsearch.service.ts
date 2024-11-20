import { Injectable } from '@nestjs/common';

import { IPaginationOptions } from '@fc/common';

import {
  BaseTracksOutputInterface,
  TracksAdapterResultsInterface,
} from '../interfaces';
import { ElasticTracksService } from './elastic-tracks.service';
import { TracksFormatterService } from './tracks-formatter.service';

@Injectable()
export class TracksAdapterElasticsearchService<
  TOutput extends BaseTracksOutputInterface,
> {
  constructor(
    private readonly elastic: ElasticTracksService,
    private readonly formatter: TracksFormatterService<TOutput>,
  ) {}

  public async getTracks(
    groupIds: string[],
    options: IPaginationOptions,
  ): Promise<TracksAdapterResultsInterface<TOutput>> {
    const { total, payload: elasticTracks } =
      await this.elastic.getElasticTracks(groupIds, options);

    const formattedTracks = this.formatter.formatTracks(elasticTracks);

    const results: TracksAdapterResultsInterface<TOutput> = {
      total,
      payload: formattedTracks,
    };

    return results;
  }
}
