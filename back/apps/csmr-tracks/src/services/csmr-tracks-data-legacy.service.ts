import { isString } from 'class-validator';
import { DateTime } from 'luxon';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { IRichClaim, ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { EVENT_MAPPING, LEGACY_SCOPES_SEPARATOR } from '../constants';
import { IdpMappings } from '../dto';
import {
  CsmrTracksTransformTracksFailedException,
  CsmrTracksUnknownActionException,
} from '../exceptions';
import {
  IAppTracksDataService,
  ICsmrTracksExtractedData,
  ICsmrTracksLegacyFieldsData,
  ICsmrTracksLegacyTransformData,
  IGeo,
} from '../interfaces';

@Injectable()
export class CsmrTracksLegacyDataService implements IAppTracksDataService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly geoip: GeoipMaxmindService,
    @Inject('ScopesFcLegacy') private readonly scopes: ScopesService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private getEventFromAction({
    action,
    type_action: typeAction,
  }: ICsmrTracksLegacyTransformData): string {
    const key = `${action}/${typeAction}`;
    const event = EVENT_MAPPING[key];
    if (!event) {
      throw new CsmrTracksUnknownActionException();
    }
    return event;
  }

  private getClaimsGroups({
    scopes,
  }: ICsmrTracksLegacyTransformData): IRichClaim[] {
    if (!scopes) {
      return [];
    }

    const richClaims = this.scopes.getRichClaimsFromScopes(
      scopes.split(LEGACY_SCOPES_SEPARATOR),
    );

    this.logger.trace({ scopes, richClaims });
    return richClaims;
  }

  private getGeoFromIp({
    userIp,
    'source.geo.city_name': city,
    'source.geo.country_iso_code': country,
    'source.geo.region_name': region,
  }: ICsmrTracksLegacyTransformData): IGeo {
    this.logger.debug('getGeoFromIp from csmr-tracks-data-legacy service');

    if (city || country) {
      return {
        city: city || region,
        country,
      };
    }
    return {
      country: this.geoip.getCountryIsoCode(userIp),
      city: this.geoip.getCityName(userIp),
    };
  }

  private getAcrValue({
    eidas = 'eidas1',
  }: ICsmrTracksLegacyTransformData): string {
    return isString(eidas) && eidas.length > 1 ? eidas : `eidas${eidas}`;
  }

  private getIdpLabel({ fi: idpName }: ICsmrTracksLegacyTransformData): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return mappings[idpName] || idpName;
  }

  transformTrack(source: ICsmrTracksLegacyTransformData) {
    const time = DateTime.fromMillis(+source.time, { zone: 'utc' }).toMillis();
    /**
     * @todo should change fi to fiLabel to get the correct data in idp Label
     * Author: Arnaud
     * Date: 06/04/2022
     */
    const { spLabel } = source;
    const idpLabel = this.getIdpLabel(source);

    const spAcr = this.getAcrValue(source);
    const event = this.getEventFromAction(source);
    const claims = this.getClaimsGroups(source);
    const { country, city } = this.getGeoFromIp(source);

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
  formatTracks(
    rawTracks: ICsmrTracksLegacyFieldsData[],
  ): ICsmrTracksOutputTrack[] {
    this.logger.debug('formatTracks from Legacy');
    try {
      const tracks = rawTracks.map(({ trackId, platform, ...rawData }) => {
        const data = this.transformTrack(rawData);
        return {
          ...data,
          trackId,
          platform,
        };
      });

      this.logger.trace({ tracks });

      return tracks;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrTracksTransformTracksFailedException(error);
    }
  }
}
