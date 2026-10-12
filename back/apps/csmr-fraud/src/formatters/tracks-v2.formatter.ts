import { SearchHit } from '@elastic/elasticsearch/lib/api/types';

import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import {
  getIpAddressFromTracks,
  getLocationFromTracks,
  getOrganizationFromTracks,
  getPortFromTracks,
  TracksFormatterAbstract,
  TracksFormatterMappingFailedException,
  TracksV2FieldsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import { Platform } from '../enums';
import { TracksFormatterOutputInterface } from '../interfaces';
import { getReadableDateFromTime } from '../utils';

@Injectable()
export class TracksV2Formatter implements TracksFormatterAbstract<TracksFormatterOutputInterface> {
  constructor(
    protected readonly logger: LoggerService,
    private readonly platform: Platform,
  ) {}

  // @NOTE disabling eslint complexity caused by `??`
  // to fix it we need to refactor the code
  // eslint-disable-next-line complexity
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
      const { country, city, region } = getLocationFromTracks(_source);
      const ipAddress = getIpAddressFromTracks(_source);
      const port = getPortFromTracks(_source) ?? '';
      const organization = getOrganizationFromTracks(_source) ?? '';
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
}
