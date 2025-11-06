import { omit } from 'lodash';
import { v4 as uuid } from 'uuid';

import { Injectable } from '@nestjs/common';

import {
  FraudCaseDto,
  FraudTrackDto,
  SanitizedTrackDto,
} from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';

import { FraudCaseSessionDto, FraudIdentitySessionDto } from '../dto';
import { FraudSummaryResponseInterface } from '../interfaces';

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
    fraudTracks,
  }: FraudCaseSessionDto): FraudCaseDto {
    const id = uuid();

    return {
      id,
      authenticationEventId: connection.code,
      contactEmail: contact.email,
      phoneNumber: contact.phone,
      comment: description.description,
      fraudTracks: fraudTracks,

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

  buildFraudSummary({
    fraudTracks,
    description,
    connection,
    identity,
    contact,
  }: FraudCaseSessionDto): FraudSummaryResponseInterface {
    const sanitizedTracks = this.sanitizeFraudTracks(fraudTracks);
    return {
      description,
      connection,
      identity,
      contact,
      fraudTracks: sanitizedTracks,
    };
  }

  sanitizeFraudTracks(fraudTracks: FraudTrackDto[]): SanitizedTrackDto[] {
    const omitProperties = [
      'id',
      'accountId',
      'date',
      'spId',
      'spName',
      'spSub',
      'idpId',
      'idpName',
      'idpSub',
      'interactionId',
      'browsingSessionId',
      'country',
      'city',
      'ipAddress',
    ];

    const sanitizedTracks: SanitizedTrackDto[] = fraudTracks.map(
      (entry) =>
        ({
          trackId: entry.id,
          spLabel: entry.spName,
          authenticationEventId: entry.browsingSessionId,
          ...omit(entry, omitProperties),
        }) as SanitizedTrackDto,
    );

    return sanitizedTracks;
  }
}
