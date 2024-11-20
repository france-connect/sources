import { Injectable } from '@nestjs/common';

import { IPaginationOptions, IPaginationResult } from '@fc/common';
import { CsmrAccountClientService } from '@fc/csmr-account-client';
import {
  TracksOutputInterface,
  TracksResultsInterface,
} from '@fc/csmr-tracks-client';
import { LoggerService } from '@fc/logger';
import { IOidcIdentity } from '@fc/oidc';
import { TracksAdapterElasticsearchService } from '@fc/tracks-adapter-elasticsearch';

@Injectable()
export class CsmrTracksService {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: CsmrAccountClientService,
    private readonly tracks: TracksAdapterElasticsearchService<TracksOutputInterface>,
  ) {}
  async getTracksForIdentity(
    identity: IOidcIdentity,
    options: IPaginationOptions,
  ): Promise<TracksResultsInterface> {
    const accountIds = await this.account.getAccountIdsFromIdentity(identity);

    if (!accountIds.length) {
      this.logger.debug('No AccountId found');
      return this.generateEmptyResults(options);
    }
    const { total, payload } = await this.tracks.getTracks(accountIds, options);

    const meta = this.getPaginationResults(options, total);

    return { meta, payload };
  }

  private getPaginationResults(
    options: IPaginationOptions,
    total: number,
  ): IPaginationResult {
    return { ...options, total };
  }

  private generateEmptyResults(options: IPaginationOptions) {
    const { size, offset } = options;
    const results: TracksResultsInterface = {
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
