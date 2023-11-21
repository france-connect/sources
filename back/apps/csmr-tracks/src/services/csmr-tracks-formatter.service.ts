import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CoreInstance } from '../enums';
import { CsmrTracksUnknownInstanceException } from '../exceptions';
import {
  TracksFcpHighFormatter,
  TracksFcpLowFormatter,
  TracksLegacyFormatter,
} from '../formatters';
import { ICsmrTracksData, TracksFormatterInterface } from '../interfaces';

@Injectable()
export class CsmrTracksFormatterService {
  constructor(
    private readonly formatterFcpHigh: TracksFcpHighFormatter,
    private readonly formatterFcpLow: TracksFcpLowFormatter,
    private readonly formatterLegacy: TracksLegacyFormatter,
  ) {}

  formatTracks(
    rawTracks: SearchHit<ICsmrTracksData>[],
  ): ICsmrTracksOutputTrack[] {
    const tracks = rawTracks.map((rawTrack) => {
      const instance = rawTrack._source.service || CoreInstance.FC_LEGACY;
      const formatter = this.getFormatter(instance);
      const track = formatter.formatTrack(rawTrack);
      return track;
    });

    return tracks;
  }

  private getFormatter(instance: CoreInstance): TracksFormatterInterface {
    switch (instance) {
      case CoreInstance.FC_LEGACY:
        return this.formatterLegacy;
      case CoreInstance.FCP_HIGH:
        return this.formatterFcpHigh;
      case CoreInstance.FCP_LOW:
        return this.formatterFcpLow;
      default:
        throw new CsmrTracksUnknownInstanceException(instance);
    }
  }
}
