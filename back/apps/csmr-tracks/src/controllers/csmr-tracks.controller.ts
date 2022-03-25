import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { LoggerLevelNames, LoggerService } from '@fc/logger';
import { TracksProtocol } from '@fc/microservices';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CsmrTracksService } from '../services';

@Controller()
export class CsmrTracksController {
  constructor(
    private readonly logger: LoggerService,
    private readonly csmrTracks: CsmrTracksService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @MessagePattern(TracksProtocol.Commands.GET)
  async getTracks(payload: {
    identityHash: string;
  }): Promise<ICsmrTracksOutputTrack[] | 'ERROR'> {
    this.logger.debug(
      `New message received with pattern "${TracksProtocol.Commands.GET}"`,
    );

    const { identityHash } = payload;

    try {
      const tracks = await this.csmrTracks.getList(identityHash);

      this.logger.trace({
        input: { payload },
        output: { tracks },
      });

      return tracks;
    } catch (error) {
      this.logger.trace({ error }, LoggerLevelNames.WARN);
      /**
       * @todo #825 implement Error protocol
       *
       * Author: Arnaud PSA
       * Date: 22/02/2022
       */
      return 'ERROR';
    }
  }
}
