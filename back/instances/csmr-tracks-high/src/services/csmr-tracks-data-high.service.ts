import { Search } from '@elastic/elasticsearch/api/requestParams';
import { pick } from 'lodash';

import { Injectable } from '@nestjs/common';

import { IAppTracksDataService } from '@fc/csmr-tracks';
import { LoggerService } from '@fc/logger';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { ICsmrTracksInputHigh } from '../interfaces';

/**
 * Array of available track's object attributes
 * used to validate the tracks received from Elasticsearch.
 * @see ICsmrTracksOutputTrack
 */
const TRACK_PROPERTIES = [
  'event',
  'date',
  'spName',
  'spAcr',
  'country',
  'city',
];

export const PLATFORM = 'FranceConnect+';

@Injectable()
export class CsmrTracksHighDataService implements IAppTracksDataService {
  constructor(protected readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  formatQuery(index: string, accountId: string): Search {
    const query: Search = {
      index,
      body: {
        query: {
          match: {
            accountId,
          },
        },
      },
    };

    return query;
  }

  /**
   * Get formated tracks reduced to their strict elements.
   * Elasticsearch add extra attributes to the stored data
   * that are not requiered.
   */
  async formattedTracks(
    rawTracks: ICsmrTracksInputHigh[],
  ): Promise<ICsmrTracksOutputTrack[]> {
    this.logger.debug('formattedTracks from core-high');
    const filteredProperties = rawTracks.map(
      ({ _id: trackId, _source: source }) => {
        const properties = pick(source, TRACK_PROPERTIES);
        const platform = PLATFORM;
        return { ...properties, trackId, platform, claims: null };
      },
    );
    return filteredProperties as ICsmrTracksOutputTrack[];
  }
}
