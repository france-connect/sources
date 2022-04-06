import { Injectable } from '@nestjs/common';

import { LoggerService } from '@fc/logger';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

@Injectable()
export class CsmrAggregrateTracksFactoryService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  mergeGroups(groups: ICsmrTracksOutputTrack[][]): ICsmrTracksOutputTrack[] {
    this.logger.debug('Merge of Tracks groups');

    const sorted = groups.flat().sort(({ time: a }, { time: b }) => a - b);
    this.logger.trace({ sorted });
    return sorted;
  }
}
