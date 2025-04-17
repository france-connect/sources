import { Injectable } from '@nestjs/common';

import {
  AccountIdsResultsInterface,
  CsmrAccountClientService,
} from '@fc/csmr-account-client';
import { FraudCaseDto, TrackingDataDto } from '@fc/csmr-fraud-client';
import { LoggerService } from '@fc/logger';
import { PivotIdentityDto } from '@fc/oidc';
import {
  TracksAdapterElasticsearchService,
  TracksAdapterResultsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import {
  SecurityTicketDataInterface,
  TracksFormatterOutputInterface,
} from '../interfaces';
import { getSecurityTicketData, getTrackingData } from '../utils';

@Injectable()
export class CsmrFraudDataService {
  constructor(
    private readonly logger: LoggerService,
    private readonly account: CsmrAccountClientService,
    private readonly tracks: TracksAdapterElasticsearchService<TracksFormatterOutputInterface>,
  ) {}

  async enrichFraudData(
    identity: PivotIdentityDto,
    fraudCase: FraudCaseDto,
  ): Promise<{
    ticketData: SecurityTicketDataInterface;
    trackingData: TrackingDataDto;
  }> {
    let accountIds: AccountIdsResultsInterface;
    try {
      accountIds = await this.account.getAccountIdsFromIdentity(identity);
    } catch (error) {
      this.logger.err(error);
      accountIds = {};
    }

    let tracks: TracksAdapterResultsInterface<TracksFormatterOutputInterface>;
    try {
      tracks = await this.tracks.getTracksForAuthenticationEventId(
        fraudCase.authenticationEventId,
      );
    } catch (error) {
      this.logger.err(error);
      tracks = { total: 0, payload: [] };
    }
    const { accountIdLow, accountIdHigh } = accountIds;
    const groupIds = [accountIdLow, accountIdHigh].filter(Boolean);

    const ticketData = getSecurityTicketData(
      identity,
      fraudCase,
      groupIds,
      tracks,
    );

    const trackingData = getTrackingData(fraudCase, accountIds, tracks);

    return { ticketData, trackingData };
  }
}
