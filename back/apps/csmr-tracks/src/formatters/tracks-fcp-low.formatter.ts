/* istanbul ignore file */

// Only injects specific service and inherit everything
import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { TracksOutputInterface } from '@fc/csmr-tracks-client';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import {
  GeoFormatterService,
  TracksFormatterAbstract,
} from '@fc/tracks-adapter-elasticsearch';

import { Platform } from '../enums';
import { TracksV2Formatter } from './tracks-v2.formatter';

@Injectable()
export class TracksFcpLowFormatter
  extends TracksV2Formatter
  implements TracksFormatterAbstract<TracksOutputInterface>
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly geoip: GeoFormatterService,
    @Inject('ScopesFcpLow') protected readonly scopes: ScopesService,
  ) {
    super(config, logger, geoip, scopes, Platform.FCP_LOW);
  }
}
