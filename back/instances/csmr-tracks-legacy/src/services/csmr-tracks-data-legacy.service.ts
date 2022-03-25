import { Search } from '@elastic/elasticsearch/api/requestParams';
import { isString } from 'class-validator';

import { Injectable } from '@nestjs/common';

import { IAppTracksDataService } from '@fc/csmr-tracks';
import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import { ServiceProviderAdapterMongoService } from '@fc/service-provider-adapter-mongo';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import {
  CsmrTracksTransformTracksFailedException,
  CsmrTracksUnknownActionException,
  CsmrTracksUnknownSpException,
} from '../exceptions';
import { formatMultiMatchGroupES } from '../helpers';
import { ICsmrTracksInputLegacy, ICsmrTracksLegacyTrack } from '../interfaces';

export const PLATFORM = 'FranceConnect';

export const LEGACY_SCOPES_SEPARATOR = ', ';

const EVENT_MAPPING = {
  'authentication/initial': 'FC_VERIFIED',
  'consent/demandeIdentity': 'FC_DATATRANSFER:CONSENT:IDENTITY',
  'consent/demandeData': 'FC_DATATRANSFER:CONSENT:DATA',
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
    private readonly service: ServiceProviderAdapterMongoService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  formatQuery(index: string, accountId: string): Search {
    const includes = formatMultiMatchGroupES(ACTIONS_TO_INCLUDE);

    const criteria = [
      { match: { accountId } },
      {
        range: {
          time: {
            gte: 'now-6M/d',
            lt: 'now',
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
            must: criteria,
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

  private async getFsLabelfromId({
    fsId,
    fs_label: fsLabel = '',
  }: ICsmrTracksLegacyTrack): Promise<string> {
    if (fsLabel.length) {
      return fsLabel;
    }
    try {
      const { name } = await this.service.getById(fsId);
      return name;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrTracksUnknownSpException(error);
    }
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
    const date = source.time;

    const spAcr = this.getAcrValue(source);
    const event = this.getEventFromAction(source);
    const claims = this.getClaimsGroups(source);
    const spName = await this.getFsLabelfromId(source);
    const { country, city } = await this.getGeoFromIp(source);

    const output: OutputTrack = {
      event,
      date,
      spName,
      spAcr,
      country,
      city,
      claims,
    };

    this.logger.trace({ source, output });
    return output;
  }

  /**
   * Get formated tracks reduced to their strict elements.
   * Elasticsearch adds extra attributes to stored data that are not required.
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

      return tracks;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrTracksTransformTracksFailedException(error);
    }
  }
}
