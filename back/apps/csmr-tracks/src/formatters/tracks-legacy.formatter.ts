import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { isString } from 'class-validator';

import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import { RichClaimInterface, ScopesService } from '@fc/scopes';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { EVENT_MAPPING, LEGACY_SCOPES_SEPARATOR } from '../constants';
import { IdpMappings } from '../dto';
import { Platform } from '../enums';
import {
  CsmrTracksTransformTracksFailedException,
  CsmrTracksUnknownActionException,
} from '../exceptions';
import {
  ICsmrTracksLegacyFieldsData,
  TracksFormatterInterface,
} from '../interfaces';
// No barrel file to prevent circular dependency
import { CsmrTracksGeoService } from '../services/csmr-tracks-geo.service';

@Injectable()
export class TracksLegacyFormatter implements TracksFormatterInterface {
  constructor(
    private readonly logger: LoggerService,
    private readonly geoip: CsmrTracksGeoService,
    private readonly config: ConfigService,
    @Inject('ScopesFcLegacy') private readonly scopes: ScopesService,
  ) {}

  formatTrack(
    rawTrack: SearchHit<ICsmrTracksLegacyFieldsData>,
  ): ICsmrTracksOutputTrack {
    this.logger.debug('formatTracks from Legacy');
    try {
      const { _id: trackId, _source } = rawTrack;
      const { fs_label: spLabel, cinematicID: authenticationEventId } = _source;
      const time = new Date(_source.time).getTime();

      /**
       * @todo should change fi to fiLabel to get the correct data in idp Label
       * Author: Arnaud
       * Date: 06/04/2022
       */
      const idpLabel = this.getIdpLabel(_source);
      const interactionAcr = this.getAcrValue(_source);
      const event = this.getEventFromAction(_source);
      const claims = this.getClaimsGroups(_source);
      const { country, city } = this.geoip.getGeoFromIp(_source);

      const output: ICsmrTracksOutputTrack = {
        event,
        time,
        spLabel,
        interactionAcr,
        idpLabel,
        country,
        city,
        claims,
        authenticationEventId,
        platform: Platform.FCP_LOW,
        trackId,
      };

      return output;
    } catch (error) {
      throw new CsmrTracksTransformTracksFailedException(error);
    }
  }

  private getEventFromAction({
    action,
    type_action: typeAction,
  }: ICsmrTracksLegacyFieldsData): string {
    const key = `${action}/${typeAction}`;
    const event = EVENT_MAPPING[key];
    if (!event) {
      throw new CsmrTracksUnknownActionException();
    }
    return event;
  }

  private getClaimsGroups({
    scopes,
  }: ICsmrTracksLegacyFieldsData): RichClaimInterface[] {
    if (!scopes) {
      return [];
    }

    const richClaims = this.scopes.getRichClaimsFromScopes(
      scopes.split(LEGACY_SCOPES_SEPARATOR),
    );

    return richClaims;
  }

  private getAcrValue({
    eidas = 'eidas1',
  }: ICsmrTracksLegacyFieldsData): string {
    return isString(eidas) && eidas.length > 1 ? eidas : `eidas${eidas}`;
  }

  private getIdpLabel({ fi: idpName }: ICsmrTracksLegacyFieldsData): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return mappings[idpName] || idpName;
  }
}
