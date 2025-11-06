import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import {
  getIpAddressFromTracks,
  getLocationFromTracks,
  TracksFormatterAbstract,
  TracksFormatterMappingFailedException,
  TracksV2FieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { Platform } from '../enums';
import { TracksFormatterOutputInterface } from '../interfaces';
import { getReadableDateFromTime } from '../utils';

@Injectable()
export class TracksV2Formatter
  implements TracksFormatterAbstract<TracksFormatterOutputInterface>
{
  constructor(
    protected readonly logger: LoggerService,
    private readonly platform: Platform,
  ) {}

  formatTrack(
    rawTrack: SearchHit<TracksV2FieldsInterface>,
  ): TracksFormatterOutputInterface {
    try {
      const { _id: id, _source } = rawTrack;
      const {
        spName,
        spId,
        accountId,
        time,
        idpName,
        idpLabel,
        idpId,
        spAcr,
        interactionAcr,
        browsingSessionId,
        interactionId,
        spSub,
        idpSub,
      } = _source;
      const { country, city } = getLocationFromTracks(_source);
      const ipAddress = getIpAddressFromTracks(_source);
      const date = getReadableDateFromTime(time);

      const output: TracksFormatterOutputInterface = {
        id,
        time,
        date,
        accountId,
        spName,
        idpName,
        idpLabel,
        spId,
        idpId,
        spSub,
        idpSub,
        platform: this.platform,
        interactionAcr: interactionAcr || spAcr,
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
