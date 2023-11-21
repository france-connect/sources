import { Injectable } from '@nestjs/common';

import { GeoipMaxmindService } from '@fc/geoip-maxmind';
import { LoggerService } from '@fc/logger-legacy';

import {
  ICsmrTracksData,
  ICsmrTracksLegacyFieldsData,
  ICsmrTracksV2FieldsData,
  IGeo,
} from '../interfaces';

@Injectable()
export class CsmrTracksGeoService {
  constructor(
    protected readonly logger: LoggerService,
    protected readonly geoip: GeoipMaxmindService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  getGeoFromIp(track: ICsmrTracksData): IGeo {
    const {
      'source.geo.city_name': city,
      'source.geo.country_iso_code': country,
      'source.geo.region_name': region,
    } = track;

    const ip = this.getIp(track);

    this.logger.debug('getGeoFromIp from csmr-tracks-data-legacy service');
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
