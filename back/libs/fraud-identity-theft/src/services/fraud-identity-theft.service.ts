import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';

import { FraudCaseSessionDto, FraudIdentitySessionDto } from '../dto';

@Injectable()
export class FraudIdentityTheftService {
  /**
   * @TODO #2230
   * Temporary method to simulate a RNIPP call
   * to retrieve pivot identity data.
   * This should be removed once the RNIPP service is implemented.
   * */
  transformToPivotIdentity(
    identity: FraudIdentitySessionDto,
  ): PivotIdentityDto {
    return {
      given_name: identity.given_name,
      family_name: identity.family_name,
      birthdate: identity.rawBirthdate,
      birthplace: identity.rawBirthplace,
      birthcountry: identity.rawBirthcountry,
      gender: '',
    };
  }

  buildFraudCase({
    connection,
    contact,
    description,
  }: FraudCaseSessionDto): FraudCaseDto {
    const id = uuid();

    return {
      id,
      authenticationEventId: connection.code,
      contactEmail: contact.email,
      phoneNumber: contact.phone,
      comment: description.description,

      /**
       * @TODO #2299
       * Retrieve the fraudSurveyOrigin from the session
       * */
      fraudSurveyOrigin: 'identite-inconnue',
      /**
       * @TODO #2230
       * Assuming the IDP email is the same as contact email
       * */
      idpEmail: contact.email,
    };
  }
}
