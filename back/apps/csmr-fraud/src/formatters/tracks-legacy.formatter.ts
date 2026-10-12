import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger';
import {
  getContextFromLegacyTracks,
  getIpAddressFromTracks,
  getLocationFromTracks,
  getOrganizationFromTracks,
  getPortFromTracks,
  TracksFormatterAbstract,
  TracksFormatterMappingFailedException,
  TracksLegacyFieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { IdpMappings } from '../dto';
import { Platform } from '../enums';
import { TracksFormatterOutputInterface } from '../interfaces';
import { getReadableDateFromTime } from '../utils';

@Injectable()
export class TracksLegacyFormatter implements TracksFormatterAbstract<TracksFormatterOutputInterface> {
  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {}

  // @NOTE disabling eslint complexity caused by `??`
  // to fix it we need to refactor the code
  // eslint-disable-next-line complexity
  formatTrack(
    rawTrack: SearchHit<TracksLegacyFieldsInterface>,
  ): TracksFormatterOutputInterface {
    this.logger.debug('formatTracks from Legacy');
    try {
      const { _id: id, _source } = rawTrack;
      const {
        spName,
        spId,
        idpName,
        idpLabel,
        idpId,
        idpSub,
        spSub,
        interactionAcr,
        interactionId,
        browsingSessionId,
      } = getContextFromLegacyTracks(_source);
      const time = new Date(_source.time).getTime();
      const safeIdpLabel = this.getIdpLabel(idpLabel, idpName);
      const date = getReadableDateFromTime(time);
      const ipAddress = getIpAddressFromTracks(_source);
      const port = getPortFromTracks(_source) ?? '';
      const organization = getOrganizationFromTracks(_source) ?? '';
      const { country, city, region } = getLocationFromTracks(_source);
      const { accountId } = _source;

      const output: TracksFormatterOutputInterface = {
        id,
        time,
        date,
        accountId,
        spName,
        idpName,
        idpLabel: safeIdpLabel,
        spId,
        idpId,
        spSub,
        idpSub,
        platform: Platform.FCP_LEGACY,
        interactionAcr: interactionAcr,
        interactionId,
        browsingSessionId,
        city,
        region: region ?? '',
        country,
        ipAddress,
        port,
        organization,
      };

      return output;
    } catch (error) {
      throw new TracksFormatterMappingFailedException(error);
    }
  }

  private getIdpLabel(idpLabel: string, idpName: string): string {
    const { mappings } = this.config.get<IdpMappings>('IdpMappings');

    return idpLabel || mappings[idpName] || idpName;
  }
}
