import { Injectable } from '@nestjs/common';

import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger';

import {
  ICsmrTracksData,
  ICsmrTracksLegacyFieldsData,
  ICsmrTracksV2FieldsData,
} from '../interfaces';

@Injectable()
export class CsmrTracksGeoService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly geoip: GeoipMaxmindService,
  ) {}

  // eslint-disable-next-line complexity
  getGeoFromIp(track: ICsmrTracksData): {
    city: string | undefined;
    country: string | undefined;
  } {
    const geo = track.source?.geo || {
      // Input data
      // eslint-disable-next-line @typescript-eslint/naming-convention
      city_name: undefined,
      // Input data
      // eslint-disable-next-line @typescript-eslint/naming-convention
      country_iso_code: undefined,
      // Input data
      // eslint-disable-next-line @typescript-eslint/naming-convention
      region_name: undefined,
    };

    const {
      city_name: city,
      country_iso_code: country,
      region_name: region,
    } = geo;

    const ip = this.getIp(track);

    this.logger.info('getGeoFromIp from csmr-tracks-data-legacy service');
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

  private getIp(track: ICsmrTracksData) {
    const ip =
      (track as ICsmrTracksV2FieldsData)?.ip ||
      (track as ICsmrTracksLegacyFieldsData)?.userIp;

    return ip;
  }
}
