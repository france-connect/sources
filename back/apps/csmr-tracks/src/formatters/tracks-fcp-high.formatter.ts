/* istanbul ignore file */

// Declarative file
import { Inject, Injectable } from '@nestjs/common';

import { ConfigService } from '@fc/config';
import { TracksOutputInterface } from '@fc/csmr-tracks-client';
import { LoggerService } from '@fc/logger';
import { ScopesService } from '@fc/scopes';
import {
  GeoFormatterService,
  Platform,
  TracksFormatterAbstract,
} from '@fc/tracks-adapter-elasticsearch';

// No barrel file to prevent circular dependency
import { TracksV2Formatter } from './tracks-v2.formatter';

@Injectable()
export class TracksFcpHighFormatter
  extends TracksV2Formatter
  implements TracksFormatterAbstract<TracksOutputInterface>
{
  constructor(
    protected readonly config: ConfigService,
    protected readonly logger: LoggerService,
    protected readonly geoip: GeoFormatterService,
    @Inject('ScopesFcpHigh') protected readonly scopes: ScopesService,
  ) {
    super(config, logger, geoip, scopes, Platform.FCP_HIGH);
  }
}
