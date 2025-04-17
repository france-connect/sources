import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import {
  getContextFromLegacyTracks,
  getIpAddressFromTracks,
  getLocationFromTracks,
  TracksFormatterAbstract,
  TracksFormatterMappingFailedException,
  TracksLegacyFieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { Platform } from '../enums';
import { TracksFormatterOutputInterface } from '../interfaces';

@Injectable()
export class TracksLegacyFormatter
  implements TracksFormatterAbstract<TracksFormatterOutputInterface>
{
  constructor(private readonly logger: LoggerService) {}

  formatTrack(
    rawTrack: SearchHit<TracksLegacyFieldsInterface>,
  ): TracksFormatterOutputInterface {
    this.logger.debug('formatTracks from Legacy');
    try {
      const { _source } = rawTrack;
      const {
        spName,
        spId,
        idpName,
        idpId,
        idpSub,
        spSub,
        interactionAcr,
        interactionId,
        browsingSessionId,
      } = getContextFromLegacyTracks(_source);
      const time = new Date(_source.time).getTime();
      const ipAddress = getIpAddressFromTracks(_source);
      const { country, city } = getLocationFromTracks(_source);
      const { accountId } = _source;

      const output: TracksFormatterOutputInterface = {
        time,
        accountId,
        spName,
        idpName,
        spId,
        idpId,
        spSub,
        idpSub,
        platform: Platform.FCP_LEGACY,
        interactionAcr: interactionAcr,
        interactionId,
        browsingSessionId,
        city,
        country,
        ipAddress,
      };

      return output;
    } catch (error) {
      throw new TracksFormatterMappingFailedException(error);
    }
  }
}
