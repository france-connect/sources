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

    const sorted = groups
      .flat()
      .sort(({ date: a }, { date: b }) => Date.parse(a) - Date.parse(b));
    this.logger.trace({ sorted });
    return sorted;
  }
}
