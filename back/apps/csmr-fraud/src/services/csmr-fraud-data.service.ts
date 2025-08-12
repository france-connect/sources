import { Injectable } from '@nestjs/common';

import {
  AccountIdsResultsInterface,
  CsmrAccountClientService,
} from '@fc/csmr-account-client';
import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { LoggerService } from '@fc/logger';
import { PivotIdentityDto } from '@fc/oidc';
import {
  TracksAdapterElasticsearchService,
  TracksAdapterResultsInterface,
} from '@fc/tracks-adapter-elasticsearch';

import {
  SecurityTicketContextInterface,
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
  ): Promise<SecurityTicketContextInterface> {
    let accountIds: AccountIdsResultsInterface;
    try {
      accountIds = await this.account.getAccountIdsFromIdentity(identity);
    } catch (error) {
      this.logger.err(error);
      accountIds = {};
    }

    const { accountIdLow, accountIdHigh } = accountIds;
    const groupIds = [accountIdLow, accountIdHigh].filter(Boolean);

    const securityTicketContext = await this.buildSecurityTicketContext(
      identity,
      fraudCase,
      accountIds,
      groupIds,
    );

    return securityTicketContext;
  }

  async enrichUnverifiedIdentityFraudData(
    identity: PivotIdentityDto,
    fraudCase: FraudCaseDto,
  ): Promise<SecurityTicketContextInterface> {
    const accountId = {};
    const groupIds = [];
    const securityTicketContext = await this.buildSecurityTicketContext(
      identity,
      fraudCase,
      accountId,
      groupIds,
    );
    return securityTicketContext;
  }

  private async buildSecurityTicketContext(
    identity: PivotIdentityDto,
    fraudCase: FraudCaseDto,
    accountIds: AccountIdsResultsInterface,
    groupIds: string[],
  ): Promise<SecurityTicketContextInterface> {
    let tracks: TracksAdapterResultsInterface<TracksFormatterOutputInterface>;
    try {
      tracks = await this.tracks.getTracksForAuthenticationEventId(
        fraudCase.authenticationEventId,
      );
    } catch (error) {
      this.logger.err(error);
      tracks = { total: 0, payload: [] };
    }

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
