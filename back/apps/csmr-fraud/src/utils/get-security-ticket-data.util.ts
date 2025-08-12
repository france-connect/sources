import { omit } from 'lodash';

import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';
import { TracksAdapterResultsInterface } from '@fc/tracks-adapter-elasticsearch';

import {
  SecurityTicketDataInterface,
  TicketTracksDataInterface,
  TracksFormatterOutputInterface,
} from '../interfaces';
import { getReadableDateFromTime } from './get-readable-date-from-time.util';

export function getSecurityTicketData(
  identity: PivotIdentityDto,
  fraudCase: FraudCaseDto,
  accountIds: string[],
  tracks: TracksAdapterResultsInterface<TracksFormatterOutputInterface>,
): SecurityTicketDataInterface {
  const {
    given_name: givenName,
    family_name: familyName,
    birthdate,
    birthplace,
    birthcountry,
  } = identity;

  const { total, payload } = tracks;

  let error = '';

  if (!accountIds.length) {
    error = `impossible de récupérer les account ids à partir de l’identité de l’usager`;
  } else if (total === 0) {
    error = `aucune trace ne correspond au code d’identitication`;
  }

  const ticketTracks = buildTicketTracks(payload, accountIds);

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
  tracks: TracksFormatterOutputInterface[],
  accountIds: string[],
): TicketTracksDataInterface[] {
  const omitProperties = [
    'spId',
    'idpId',
    'interactionId',
    'browsingSessionId',
    'accountId',
    'time',
  ];

  const ticketTracks: TicketTracksDataInterface[] = tracks.map(
    (entry) =>
      ({
        date: getReadableDateFromTime(entry.time),
        accountIdMatch: accountIds.includes(entry.accountId),
        ...omit(entry, omitProperties),
      }) as TicketTracksDataInterface,
  );

  return ticketTracks;
}
