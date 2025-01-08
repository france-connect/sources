import { SearchHit } from '@elastic/elasticsearch/lib/api/typesWithBodyKey';

import { Inject, Injectable } from '@nestjs/common';

import { CoreInstance } from '../enums';
import { TracksFormatterUnknownInstanceException } from '../exceptions';
import {
  ElasticTracksType,
  TracksFormatterAbstract,
  TracksFormatterOutputAbstract,
} from '../interfaces';

@Injectable()
export class TracksFormatterService<
  TOutput extends TracksFormatterOutputAbstract,
> {
  constructor(
    @Inject('TracksFcpHighFormatter')
    private readonly formatterFcpHigh: TracksFormatterAbstract<TOutput>,
    @Inject('TracksFcpLowFormatter')
    private readonly formatterFcpLow: TracksFormatterAbstract<TOutput>,
    @Inject('TracksLegacyFormatter')
    private readonly formatterLegacy: TracksFormatterAbstract<TOutput>,
  ) {}

  public formatTracks(
    elasticTracks: SearchHit<ElasticTracksType>[],
  ): TOutput[] {
    const formattedTracks = elasticTracks.map((elasticTrack) => {
      const instance = elasticTrack._source.service || CoreInstance.FC_LEGACY;
      const formatter = this.getFormatter(instance);
      const track = formatter.formatTrack(elasticTrack);
      return track;
    });

    return formattedTracks;
  }

  private getFormatter(
    instance: CoreInstance,
  ): TracksFormatterAbstract<TOutput> {
    switch (instance) {
      case CoreInstance.FC_LEGACY:
        return this.formatterLegacy;
      case CoreInstance.FCP_HIGH:
        return this.formatterFcpHigh;
      case CoreInstance.FCP_LOW:
        return this.formatterFcpLow;
      default:
        throw new TracksFormatterUnknownInstanceException(instance);
    }
  }
}
