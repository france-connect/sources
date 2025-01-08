/* istanbul ignore file */

// Only injects specific service and inherit everything
import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { TracksFormatterAbstract } from '@fc/tracks-adapter-elasticsearch';

import { Platform } from '../enums';
import { TracksFormatterOutputInterface } from '../interfaces';
import { TracksV2Formatter } from './tracks-v2.formatter';

@Injectable()
export class TracksFcpHighFormatter
  extends TracksV2Formatter
  implements TracksFormatterAbstract<TracksFormatterOutputInterface>
{
  constructor(protected readonly logger: LoggerService) {
    super(logger, Platform.FCP_HIGH);
  }
}
