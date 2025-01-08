import { Injectable } from '@nestjs/common';

import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { LoggerService } from '@fc/logger';
import { PivotIdentityDto } from '@fc/oidc';
import _ = require('lodash');

import { SecurityTicketDataInterface } from '../interfaces';
import { CsmrFraudTracksService } from './csmr-fraud-tracks.service';

@Injectable()
export class CsmrFraudDataService {
  constructor(
    private readonly logger: LoggerService,
    private readonly tracks: CsmrFraudTracksService,
  ) {}

  async enrichFraudData(
    identity: PivotIdentityDto,
    fraudCase: FraudCaseDto,
  ): Promise<SecurityTicketDataInterface> {
    const {
      given_name: givenName,
      family_name: familyName,
      birthdate,
      birthplace,
      birthcountry,
    } = identity;

    const {
      contactEmail,
      idpEmail,
      authenticationEventId,
      fraudSurveyOrigin,
      comment,
      phoneNumber,
    } = fraudCase;

    const { error, total, tracks } =
      await this.tracks.getTracksForAuthenticationEventId(
        identity,
        fraudCase.authenticationEventId,
      );

    if (error) {
      this.logger.debug(error);
    }

    const ticketData: SecurityTicketDataInterface = {
      givenName,
      familyName,
      birthdate,
      birthplace,
      birthcountry,
      contactEmail,
      idpEmail,
      authenticationEventId,
      fraudSurveyOrigin,
      comment,
      phoneNumber,
      error,
      total,
      tracks,
    };

    return ticketData;
  }
}
