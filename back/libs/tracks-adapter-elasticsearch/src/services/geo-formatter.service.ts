import { Injectable } from '@nestjs/common';

import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger';

import {
  ElasticTracksType,
  TracksLegacyFieldsInterface,
  TracksV2FieldsInterface,
} from '../interfaces';

@Injectable()
export class GeoFormatterService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly geoip: GeoipMaxmindService,
  ) {}

  // eslint-disable-next-line complexity
  getGeoFromIp(track: ElasticTracksType): {
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

  private getIp(track: ElasticTracksType) {
    const ip =
      (track as TracksV2FieldsInterface)?.ip ||
      (track as TracksLegacyFieldsInterface)?.userIp;

    return ip;
  }
}
