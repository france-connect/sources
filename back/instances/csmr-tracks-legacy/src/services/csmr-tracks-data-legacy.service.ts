import { Search } from '@elastic/elasticsearch/api/requestParams';
import { isString } from 'class-validator';
import { DateTime } from 'luxon';

import { Injectable } from '@nestjs/common';

import {
  CsmrTracksTransformTracksFailedException,
  IAppTracksDataService,
} from '@fc/csmr-tracks';
import { formatMultiMatchGroup } from '@fc/elasticsearch';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import {
  ACTIONS_TO_INCLUDE,
  EVENT_MAPPING,
  LEGACY_SCOPES_SEPARATOR,
  NOW,
  PLATFORM,
  SIX_MONTHS_AGO,
} from '../constants';
import { CsmrTracksUnknownActionException } from '../exceptions';
import {
  ICsmrTracksExtractedData,
  ICsmrTracksInputLegacy,
  ICsmrTracksLegacyTrack,
  IGeo,
} from '../interfaces';

@Injectable()
export class CsmrTracksLegacyDataService implements IAppTracksDataService {
  constructor(
    private readonly logger: LoggerService,
    private readonly scopes: ScopesService,
    private readonly geoip: GeoipMaxmindService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  formatQuery(index: string, accountId: string): Search {
    const includes = formatMultiMatchGroup(ACTIONS_TO_INCLUDE);

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
      includes,
    ];

    const query: Search = {
      index,
      body: {
        from: 0,
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

  private getEventFromAction({
    action,
    type_action: typeAction,
  }: ICsmrTracksLegacyTrack): string {
    const key = `${action}/${typeAction}`;
    const event = EVENT_MAPPING[key];
    if (!event) {
      throw new CsmrTracksUnknownActionException();
    }
    return event;
  }

  private getClaimsGroups({ scopes }: ICsmrTracksLegacyTrack): string[] | null {
    /**
     * @todo #820
     * add scope and label management here
     *
     * Arnaud PSA: 07/02/2022
     */
    if (!scopes) {
      return null;
    }

    const list = scopes.split(LEGACY_SCOPES_SEPARATOR);
    const claims = this.scopes.getRawClaimsFromScopes(list);

    // the core-legacy logs intentionally remove sub in traces
    // we need it back.
    return claims.includes('sub') ? claims : [...claims, 'sub'];
  }

  private getGeoFromIp({ userIp, source }: ICsmrTracksLegacyTrack): IGeo {
    this.logger.debug('getGeoFromIp from csmr-tracks-data-legacy service');

    let country: string;
    let city: string;

    if (source?.geo) {
      city = source.geo.city_name || source.geo.region_name;
      country = source.geo.country_iso_code;
    } else {
      city = this.geoip.getCityName(userIp);
      country = this.geoip.getCountryIsoCode(userIp);
    }
    return {
      country,
      city,
    };
  }

  private getAcrValue({ eidas }: ICsmrTracksLegacyTrack): string {
    return isString(eidas) && eidas.length > 1 ? eidas : `eidas${eidas}`;
  }

  async transformTrack(source: ICsmrTracksLegacyTrack) {
    const time = DateTime.fromISO(source.time, { zone: 'utc' }).toMillis();
    /**
     * @todo should change fi to fiLabel to get the correct data in idp Label
     * Author: Arnaud
     * Date: 06/04/2022
     */
    const { fi: idpLabel, fs_label: spLabel } = source;

    const spAcr = this.getAcrValue(source);
    const event = this.getEventFromAction(source);
    const claims = this.getClaimsGroups(source);
    const { country, city } = await this.getGeoFromIp(source);

    const output: ICsmrTracksExtractedData = {
      event,
      time,
      spLabel,
      spAcr,
      idpLabel,
      country,
      city,
      claims,
    };

    this.logger.trace({ source, output });
    return output;
  }

  /**
   * Get formated tracks reduced to their strict elements.
   * Elasticsearch adds extra attributes to stored data
   * that are not required.
   */
  async formattedTracks(
    rawTracks: ICsmrTracksInputLegacy[],
  ): Promise<ICsmrTracksOutputTrack[]> {
    this.logger.debug('formattedTracks from Legacy');
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
