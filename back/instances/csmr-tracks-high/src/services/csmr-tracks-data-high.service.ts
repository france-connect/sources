import { Search } from '@elastic/elasticsearch/api/requestParams';

import { Injectable } from '@nestjs/common';

import {
  CsmrTracksTransformTracksFailedException,
  IAppTracksDataService,
} from '@fc/csmr-tracks';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { ICsmrTracksHighTrack, ICsmrTracksInputHigh } from '../interfaces';

export const PLATFORM = 'FranceConnect+';

const SIX_MONTHS_AGO = 'now-6M/d';
const NOW = 'now';

const EVENTS_TO_INCLUDE: Partial<ICsmrTracksHighTrack>[] = [
  {
    event: 'FC_VERIFIED',
  },
  {
    event: 'FC_DATATRANSFER_CONSENT_IDENTITY',
  },
  {
    event: 'FC_DATATRANSFER_CONSENT_DATA',
  },
  {
    event: 'DP_REQUESTED_FC_CHECKTOKEN',
  },
];

type OutputTrack = Omit<ICsmrTracksOutputTrack, 'platform' | 'trackId'>;
interface GeoIp {
  country: string;
  city: string;
}

@Injectable()
export class CsmrTracksHighDataService implements IAppTracksDataService {
  constructor(protected readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  formatQuery(index: string, accountId: string): Search {
    /**
     * /!\ we can use "terms" here because there is only one params field to filter
     */
    const terms = EVENTS_TO_INCLUDE.map(({ event }) => event);

    const criteria = [
      { term: { accountId } },
      {
        range: {
          time: {
            gte: SIX_MONTHS_AGO,
            lt: NOW,
          },
        },
      },
      {
        terms: {
          event: terms,
        },
      },
    ];

    const query: Search = {
      index,
      body: {
        from: 0,
        size: 100,
        sort: [{ time: { order: 'desc' } }],
        query: {
          bool: {
            filter: criteria,
          },
        },
      },
    };

    this.logger.trace({ query });

    return query;
  }

  private getClaimsGroups({ claims }: ICsmrTracksHighTrack): string[] | null {
    /**
     * @todo #820
     * add scope and label management here
     *
     * Arnaud PSA: 07/02/2022
     */
    return claims ? claims.split(' ') : null;
  }

  private async getGeoFromIp({ ip: _ }: ICsmrTracksHighTrack): Promise<GeoIp> {
    /**
     * @todo add GeoIp management here
     *
     * Arnaud PSA: 07/02/2022
     */
    return {
      country: 'FR',
      city: 'Paris',
    };
  }

  async transformTrack(source: ICsmrTracksHighTrack) {
    const { event, time, spName, spAcr, idpName } = source;

    const claims = this.getClaimsGroups(source);
    const { country, city } = await this.getGeoFromIp(source);

    const output: OutputTrack = {
      event,
      time,
      spName,
      spAcr,
      country,
      city,
      claims,
      idpName,
    };

    this.logger.trace({ source, output });
    return output;
  }

  /**
   * Get formated tracks reduced to their strict elements.
   * Elasticsearch add extra attributes to the stored data
   * that are not required.
   */
  async formattedTracks(
    rawTracks: ICsmrTracksInputHigh[],
  ): Promise<ICsmrTracksOutputTrack[]> {
    this.logger.debug('formattedTracks from core-high');

    const filteredProperties = rawTracks.map(
      async ({ _id: trackId, _source: source }) => {
        const data = await this.transformTrack(source);
        return {
          ...data,
          trackId,
          platform: PLATFORM,
        };
      },
    );
    try {
      const tracks = await Promise.all(filteredProperties);

      this.logger.trace({ tracks });

      return tracks;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrTracksTransformTracksFailedException(error);
    }
  }
}
