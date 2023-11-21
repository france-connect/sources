/* istanbul ignore file */

// Declarative file
import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { LoggerService } from '@fc/logger-legacy';
import { ScopesService } from '@fc/scopes';

import { Platform } from '../enums';
import { TracksFormatterInterface } from '../interfaces';
// No barrel file to prevent circular dependency
import { CsmrTracksGeoService } from '../services/csmr-tracks-geo.service';
import { TracksV2Formatter } from './tracks-v2.formatter';

@Injectable()
export class TracksFcpLowFormatter
  extends TracksV2Formatter
  implements TracksFormatterInterface
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly geoip: CsmrTracksGeoService,
    @Inject('ScopesFcpLow') protected readonly scopes: ScopesService,
  ) {
    super(config, logger, geoip, scopes, Platform.FCP_LOW);
  }
}
