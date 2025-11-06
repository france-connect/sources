import { omit } from 'lodash';

import { FraudCaseDto, FraudTrackDto } from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';

import {
  SecurityTicketDataInterface,
  TicketTracksDataInterface,
} from '../interfaces';

export function getSecurityTicketData(
  identity: PivotIdentityDto,
  fraudCase: FraudCaseDto,
  accountIds: string[],
  fraudTracks: FraudTrackDto[],
): SecurityTicketDataInterface {
  const {
    given_name: givenName,
    family_name: familyName,
    birthdate,
    birthplace,
    birthcountry,
  } = identity;
  const total = fraudTracks.length;

  let error = '';

  if (!accountIds.length) {
    error = `impossible de récupérer les account ids à partir de l’identité de l’usager`;
  } else if (total === 0) {
    error = `aucune trace ne correspond au code d’identitication`;
  }

  const ticketTracks = buildTicketTracks(fraudTracks, accountIds);

  const { id: fraudCaseId, ...fraudCaseWithoutId } = fraudCase;

  const ticketData: SecurityTicketDataInterface = {
    givenName,
    familyName,
    birthdate,
    birthplace,
    birthcountry,
    error,
    total,
    tracks: ticketTracks,
    comment: '',
    phoneNumber: '',
    fraudCaseId,
    ...fraudCaseWithoutId,
  };

  return ticketData;
}

function buildTicketTracks(
  tracks: FraudTrackDto[],
  accountIds: string[],
): TicketTracksDataInterface[] {
  const omitProperties = [
    'id',
    'spId',
    'idpId',
    'idpLabel',
    'interactionId',
    'browsingSessionId',
    'accountId',
    'time',
  ];

  const ticketTracks: TicketTracksDataInterface[] = tracks.map(
    (entry) =>
      ({
        accountIdMatch: accountIds.includes(entry.accountId),
        ...omit(entry, omitProperties),
      }) as TicketTracksDataInterface,
  );

  return ticketTracks;
}
