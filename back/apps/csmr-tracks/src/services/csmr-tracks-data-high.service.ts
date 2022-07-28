import { DateTime } from 'luxon';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { IRichClaim, ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { IdpMappings } from '../dto';
import { CsmrTracksTransformTracksFailedException } from '../exceptions';
import {
  IAppTracksDataService,
  ICsmrTracksExtractedData,
  ICsmrTracksHighFieldsData,
  ICsmrTracksHighTransformData,
  IGeo,
} from '../interfaces';

@Injectable()
export class CsmrTracksHighDataService implements IAppTracksDataService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly geoip: GeoipMaxmindService,
    @Inject('ScopesFcpHigh') private readonly scopes: ScopesService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private getClaimsGroups({
    claims,
  }: ICsmrTracksHighTransformData): IRichClaim[] {
    if (!claims) {
      return [];
    }

    const richClaims = this.scopes.getRichClaimsFromClaims(claims.split(' '));

    this.logger.trace({ claims, richClaims });

    return richClaims;
  }

  private getGeoFromIp({
    ip,
    'source.geo.city_name': city,
    'source.geo.country_iso_code': country,
    'source.geo.region_name': region,
  }: ICsmrTracksHighTransformData): IGeo {
    this.logger.debug('getGeoFromIp from csmr-tracks-data-legacy service');
    if (city || country) {
      return {
        city: city || region,
        country,
      };
    }
    return {
      country: this.geoip.getCountryIsoCode(ip),
      city: this.geoip.getCityName(ip),
    };
  }

  private getIdpLabel({
    idpLabel,
    idpName,
  }: ICsmrTracksHighTransformData): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return idpLabel || mappings[idpName] || idpName;
  }

  transformTrack(source: ICsmrTracksHighTransformData) {
    const { event, spLabel, spAcr } = source;

    const time = DateTime.fromMillis(+source.time, { zone: 'utc' }).toMillis();

    const idpLabel = this.getIdpLabel(source);
    const claims = this.getClaimsGroups(source);
    const { country, city } = this.getGeoFromIp(source);

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
  formatTracks(
    rawTracks: ICsmrTracksHighFieldsData[],
  ): ICsmrTracksOutputTrack[] {
    this.logger.debug('formatTracks from core-high');

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
