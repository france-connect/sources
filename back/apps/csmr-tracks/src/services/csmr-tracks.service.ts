import { Injectable } from '@nestjs/common';

import { Account, AccountService } from '@fc/account';
import { LoggerLevelNames, LoggerService } from '@fc/logger-legacy';
import { ICsmrTracksOutputTrack } from '@fc/tracks';

import { CsmrTracksElasticsearchService } from './csmr-tracks-elasticsearch.service';

@Injectable()
export class CsmrTracksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: AccountService,
    private readonly elasticsearch: CsmrTracksElasticsearchService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getList(identityHash: string): Promise<ICsmrTracksOutputTrack[]> {
    this.logger.debug(`Get user tracks from identityHash`);
    this.logger.trace({ identityHash });

    // -- search account in Mongo from its identityHash
    const { id: accountId }: Account =
      await this.account.getAccountByIdentityHash(identityHash);
    if (!accountId) {
      this.logger.trace(
        { error: 'No account found', identityHash },
        LoggerLevelNames.WARN,
      );
      // Do not throw, user can have no traces in specific platform like FC+
      return [];
    }

    this.logger.trace({ accountId });

    // -- search all traces of this account in Elasticsearch from its account id
    const tracks: ICsmrTracksOutputTrack[] =
      await this.elasticsearch.getTracksByAccountId(accountId);
    if (!tracks.length) {
      this.logger.trace({ error: 'No traces found' }, LoggerLevelNames.WARN);
      // Do not throw, user can have no traces in specific platform like FC+
      return [];
    }

    this.logger.trace({ tracks });

    return tracks;
  }
}
