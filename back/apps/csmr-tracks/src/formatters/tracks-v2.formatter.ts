import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { TracksOutputInterface } from '@fc/csmr-tracks-client';
import { LoggerService } from '@fc/logger';
import { RichClaimInterface, ScopesService } from '@fc/scopes';
import {
  GeoFormatterService,
  Platform,
  TracksFormatterAbstract,
  TracksFormatterMappingFailedException,
  TracksV2FieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { IdpMappings } from '../dto';

@Injectable()
export class TracksV2Formatter
  implements TracksFormatterAbstract<TracksOutputInterface>
{
  // Allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly geoip: GeoFormatterService,
    protected readonly scopes: ScopesService,
    private readonly platform: Platform,
  ) {}

  /**
   * Get formated tracks reduced to their strict elements.
   * Elasticsearch add extra attributes to the stored data
   * that are not required.
   */
  formatTrack(
    rawTrack: SearchHit<TracksV2FieldsInterface>,
  ): TracksOutputInterface {
    try {
      const { _id: trackId, _source } = rawTrack;
      const {
        event,
        spName: spLabel,
        spAcr,
        interactionAcr,
        time,
        browsingSessionId: authenticationEventId,
      } = _source;

      const idpLabel = this.getIdpLabel(_source);
      const claims = this.getClaimsGroups(_source);
      const { country, city } = this.geoip.getGeoFromIp(_source);

      const output: TracksOutputInterface = {
        event,
        time,
        spLabel,
        interactionAcr: interactionAcr || spAcr,
        country,
        city,
        claims,
        idpLabel,
        trackId,
        authenticationEventId,
        platform: this.platform,
      };

      return output;
    } catch (error) {
      throw new TracksFormatterMappingFailedException(error);
    }
  }

  // eslint-disable-next-line complexity
  private getClaimsGroups({
    claims,
    scope,
  }: TracksV2FieldsInterface): RichClaimInterface[] {
    if (!claims && !scope) {
      return [];
    }

    let richClaims: RichClaimInterface[];

    if (claims) {
      richClaims = this.scopes.getRichClaimsFromClaims(claims.split(' '));
    }

    if (scope) {
      richClaims = this.scopes.getRichClaimsFromScopes(scope.split(' '));
    }

    return richClaims;
  }

  private getIdpLabel({ idpLabel, idpName }: TracksV2FieldsInterface): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return idpLabel || mappings[idpName] || idpName;
  }
}
