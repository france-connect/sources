import { Reader, ReaderModel } from '@maxmind/geoip2-node';

import { Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';

import { GeoipMaxmindConfig } from './dto';
import { GeoipMaxmindNotFoundException } from './exceptions';

@Injectable()
export class GeoipMaxmindService {
  private db: ReaderModel;

  constructor(
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async onModuleInit() {
    await this.loadDatabase();
  }

  async loadDatabase(): Promise<void | GeoipMaxmindNotFoundException> {
    try {
      const { path: localDBPath } =
        this.config.get<GeoipMaxmindConfig>('GeoipMaxmind');
      this.db = await Reader.open(localDBPath);
    } catch (e) {
      this.logger.trace(e);
      throw new GeoipMaxmindNotFoundException();
    }
  }

  getCityName(ip: string): string | undefined {
    try {
      const dataGeoip = this.db.city(ip);
      return dataGeoip.city.names.fr || dataGeoip.city.names.en;
    } catch (error) {
      this.logger.trace({ error });
      return void 0;
    }
  }

  getCountryIsoCode(ip: string): string | undefined {
    try {
      const dataGeoip = this.db.city(ip);
      return dataGeoip.country.isoCode;
    } catch (e) {
      this.logger.trace(e);
      return void 0;
    }
  }
}
