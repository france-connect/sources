import { Injectable } from '@nestjs/common';

import { Account, AccountNotFoundException, AccountService } from '@fc/account';
import { CryptographyFcpService, IPivotIdentity } from '@fc/cryptography-fcp';
import { LoggerLevelNames, LoggerService } from '@fc/logger';

import { CsrmTracksNoTracksException } from '../exceptions';
import { ICsmrTracksOutputTrack } from '../interfaces';
import { CsmrTracksElasticsearchService } from './csmr-tracks-elasticsearch.service';

@Injectable()
export class CsmrTracksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: AccountService,
    private readonly cryptographyFcp: CryptographyFcpService,
    private readonly elasticsearch: CsmrTracksElasticsearchService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async getList(identity: IPivotIdentity): Promise<ICsmrTracksOutputTrack[]> {
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);

    // -- search account in Mongo from its identityHash
    const { id }: Account = await this.account.getAccountByIdentityHash(
      identityHash,
    );
    if (id === null) {
      this.logger.trace(
        { error: 'No account found', identityHash },
        LoggerLevelNames.WARN,
      );
      throw new AccountNotFoundException();
    }

    // -- search all traces of this account in Elasticsearch from its account id
    const tracks: ICsmrTracksOutputTrack[] =
      await this.elasticsearch.getTracksByAccountId(id);
    if (tracks.length <= 0) {
      this.logger.trace({ error: 'No traces found' }, LoggerLevelNames.WARN);
      throw new CsrmTracksNoTracksException();
    }

    this.logger.trace({ accountId: id, identity, identityHash, tracks });

    return tracks;
  }
}
