import { Injectable } from '@nestjs/common';

import { IPaginationOptions } from '@fc/common';
import { CryptographyFcpService } from '@fc/cryptography-fcp';
import { LoggerService } from '@fc/logger-legacy';
import { IOidcIdentity } from '@fc/oidc';
import { TracksResults } from '@fc/tracks';

import { CsmrTracksAccountService } from './csmr-tracks-account.service';
import { CsmrTracksElasticService } from './csmr-tracks-elastic.service';
import { CsmrTracksFormatterService } from './csmr-tracks-formatter.service';

@Injectable()
export class CsmrTracksService {
  // Allowed for DI
  // eslint-disable-next-line max-params
  constructor(
    private readonly logger: LoggerService,
    private readonly account: CsmrTracksAccountService,
    private readonly elastic: CsmrTracksElasticService,
    private readonly formatter: CsmrTracksFormatterService,
    private readonly cryptographyFcp: CryptographyFcpService,
  ) {
    this.logger.setContext(this.constructor.name);
  }
  async getTracksForIdentity(
    identity: IOidcIdentity,
    options: IPaginationOptions,
  ): Promise<TracksResults> {
    const identityHash = this.cryptographyFcp.computeIdentityHash(identity);
    const accountIds = await this.account.getIdsWithIdentityHash(identityHash);

    if (!accountIds.length) {
      this.logger.debug('No AccountId found');
      return this.generateEmptyResults(options);
    }

    const { meta, payload: rawTracks } = await this.elastic.getTracks(
      accountIds,
      options,
    );

    const payload = this.formatter.formatTracks(rawTracks);

    const results: TracksResults = { meta, payload };

    return results;
  }

  private generateEmptyResults(options: any) {
    const { size, offset } = options as IPaginationOptions;
    const results: TracksResults = {
      meta: {
        total: 0,
        size,
        offset,
      },
      payload: [],
    };
    return results;
  }
}
