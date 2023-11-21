import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { IRichClaim, ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { IdpMappings } from '../dto';
import { Platform } from '../enums';
import { CsmrTracksTransformTracksFailedException } from '../exceptions';
import {
  ICsmrTracksV2FieldsData,
  TracksFormatterInterface,
} from '../interfaces';
import { CsmrTracksGeoService } from '../services/csmr-tracks-geo.service';

@Injectable()
export class TracksV2Formatter implements TracksFormatterInterface {
  // Allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly geoip: CsmrTracksGeoService,
    protected readonly scopes: ScopesService,
    private readonly platform: Platform,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  /**
   * Get formated tracks reduced to their strict elements.
   * Elasticsearch add extra attributes to the stored data
   * that are not required.
   */
  formatTrack(
    rawTrack: SearchHit<ICsmrTracksV2FieldsData>,
  ): ICsmrTracksOutputTrack {
    try {
      const { _id: trackId, _source } = rawTrack;
      const { event, spName: spLabel, spAcr, time } = _source;

      const idpLabel = this.getIdpLabel(_source);
      const claims = this.getClaimsGroups(_source);
      const { country, city } = this.geoip.getGeoFromIp(_source);

      const output: ICsmrTracksOutputTrack = {
        event,
        time,
        spLabel,
        spAcr,
        country,
        city,
        claims,
        idpLabel,
        trackId,
        platform: this.platform,
      };

      this.logger.trace({ rawTrack, output });

      return output;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      throw new CsmrTracksTransformTracksFailedException(error);
    }
  }

  private getClaimsGroups({ claims }: ICsmrTracksV2FieldsData): IRichClaim[] {
    if (!claims) {
      return [];
    }

    const richClaims = this.scopes.getRichClaimsFromClaims(claims.split(' '));

    this.logger.trace({ claims, richClaims });

    return richClaims;
  }

  private getIdpLabel({ idpLabel, idpName }: ICsmrTracksV2FieldsData): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return idpLabel || mappings[idpName] || idpName;
  }
}
