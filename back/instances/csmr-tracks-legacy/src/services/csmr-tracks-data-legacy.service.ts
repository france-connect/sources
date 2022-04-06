import { Search } from '@elastic/elasticsearch/api/requestParams';
import { isString } from 'class-validator';
import { DateTime } from 'luxon';

import { Injectable } from '@nestjs/common';

import {
  CsmrTracksTransformTracksFailedException,
  IAppTracksDataService,
} from '@fc/csmr-tracks';
import { formatMultiMatchGroup } from '@fc/elasticsearch';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CsmrTracksUnknownActionException } from '../exceptions';
import { ICsmrTracksInputLegacy, ICsmrTracksLegacyTrack } from '../interfaces';

export const PLATFORM = 'FranceConnect';

const SIX_MONTHS_AGO = 'now-6M/d';
const NOW = 'now';

export const LEGACY_SCOPES_SEPARATOR = ', ';

const EVENT_MAPPING = {
  'authentication/initial': 'FC_VERIFIED',
  'consent/demandeIdentity': 'FC_DATATRANSFER_CONSENT_IDENTITY',
  'consent/demandeData': 'FC_DATATRANSFER_CONSENT_DATA',
  'checkedToken/verification': 'DP_REQUESTED_FC_CHECKTOKEN',
};

const ACTIONS_TO_INCLUDE: Partial<ICsmrTracksLegacyTrack>[] = [
  {
    action: 'authentication',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'initial',
  },
  {
    action: 'consent',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'demandeIdentity',
  },
  {
    action: 'consent',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'demandeData',
  },
  {
    action: 'checkedToken',
    // Legacy property name
    // eslint-disable-next-line @typescript-eslint/naming-convention
    type_action: 'verification',
  },
];

type OutputTrack = Omit<ICsmrTracksOutputTrack, 'platform' | 'trackId'>;

interface GeoIp {
  country: string;
  city: string;
}

@Injectable()
export class CsmrTracksLegacyDataService implements IAppTracksDataService {
  constructor(
    private readonly logger: LoggerService,
    private readonly scopes: ScopesService,
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
    const claims = this.scopes.getClaimsFromScopes(list);

    // the core-legacy logs intentionally remove sub in traces
    // we need it back.
    return claims.includes('sub') ? claims : [...claims, 'sub'];
  }

  private async getGeoFromIp({
    userIp: _,
  }: ICsmrTracksLegacyTrack): Promise<GeoIp> {
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

  private getAcrValue({ eidas }: ICsmrTracksLegacyTrack): string {
    return isString(eidas) && eidas.length > 1 ? eidas : `eidas${eidas}`;
  }

  async transformTrack(source: ICsmrTracksLegacyTrack) {
    const time = DateTime.fromISO(source.time, { zone: 'utc' }).toMillis();
    const { fi: idpName, fs_label: spName } = source;

    const spAcr = this.getAcrValue(source);
    const event = this.getEventFromAction(source);
    const claims = this.getClaimsGroups(source);
    const { country, city } = await this.getGeoFromIp(source);

    const output: OutputTrack = {
      event,
      time,
      spName,
      spAcr,
      idpName,
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
