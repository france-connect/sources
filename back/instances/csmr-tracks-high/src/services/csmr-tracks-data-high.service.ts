import { Search } from '@elastic/elasticsearch/api/requestParams';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import {
  CsmrTracksTransformTracksFailedException,
  IAppTracksDataService,
} from '@fc/csmr-tracks';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { IRichClaim, ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { EVENTS_TO_INCLUDE, NOW, PLATFORM, SIX_MONTHS_AGO } from '../constants';
import { IdpMappings } from '../dto';
import {
  ICsmrTracksExtractedData,
  ICsmrTracksHighTrack,
  ICsmrTracksInputHigh,
  IGeo,
} from '../interfaces';

@Injectable()
export class CsmrTracksHighDataService implements IAppTracksDataService {
  constructor(
    protected readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly geoip: GeoipMaxmindService,
    private readonly scopes: ScopesService,
  ) {
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

  private getClaimsGroups({ claims }: ICsmrTracksHighTrack): IRichClaim[] {
    if (!claims) {
      return [];
    }

    const richClaims = this.scopes.getRichClaimsFromClaims(claims.split(' '));

    this.logger.trace({ claims, richClaims });

    return richClaims;
  }

  private getGeoFromIp({ ip, source }: ICsmrTracksHighTrack): IGeo {
    this.logger.debug('getGeoFromIp from csmr-tracks-data-high service');

    let country: string;
    let city: string;

    if (source?.geo) {
      city = source.geo.city_name || source.geo.region_name;
      country = source.geo.country_iso_code;
    } else {
      city = this.geoip.getCityName(ip);
      country = this.geoip.getCountryIsoCode(ip);
    }

    return {
      country,
      city,
    };
  }

  private getIdpLabel({ idpLabel, idpName }: ICsmrTracksHighTrack): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return idpLabel || mappings[idpName] || idpName;
  }

  async transformTrack(source: ICsmrTracksHighTrack) {
    /**
     * @todo should change spName to spLabel to get the correct data in sp label
     * Author: Arnaud
     * Date: 06/04/2022
     */
    const { event, time, spName: spLabel, spAcr } = source;

    const idpLabel = this.getIdpLabel(source);
    const claims = this.getClaimsGroups(source);
    const { country, city } = await this.getGeoFromIp(source);

    const output: ICsmrTracksExtractedData = {
      event,
      time,
      spLabel,
      spAcr,
      country,
      city,
      claims,
      idpLabel,
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
