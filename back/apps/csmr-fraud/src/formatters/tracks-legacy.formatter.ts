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
import { getReadableDateFromTime } from '../utils';

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
      const { spName, idpName, idpSub, spSub, interactionAcr } =
        getContextFromLegacyTracks(_source);
      const time = new Date(_source.time).getTime();
      const date = getReadableDateFromTime(time);
      const ipAddress = getIpAddressFromTracks(_source);
      const { country, city } = getLocationFromTracks(_source);
      const { accountId } = _source;

      const output: TracksFormatterOutputInterface = {
        date,
        spName,
        idpName,
        country,
        city,
        platform: Platform.FCP_LEGACY,
        accountId,
        interactionAcr,
        idpSub,
        spSub,
        ipAddress,
      };

      return output;
    } catch (error) {
      throw new TracksFormatterMappingFailedException(error);
    }
  }
}
