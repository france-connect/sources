import { Injectable } from '@nestjs/common';

import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { IOidcIdentity } from '@fc/oidc';
import _ = require('lodash');
import { SecurityTicketDataInterface } from '../interfaces';

@Injectable()
export class CsmrFraudDataService {
  enrichFraudData(
    identity: Partial<IOidcIdentity>,
    fraudCase: FraudCaseDto,
  ): SecurityTicketDataInterface {
    const {
      given_name: givenName,
      family_name: familyName,
      birthdate,
      birthplace,
      birthcountry,
    } = identity;

    const ticketData: SecurityTicketDataInterface = {
      givenName,
      familyName,
      birthdate,
      birthplace,
      birthcountry,
      ...fraudCase,
    };

    return ticketData;
  }
}
