import { FraudCaseDto } from '@fc/csmr-fraud-client';
import { PivotIdentityDto } from '@fc/oidc';
import { TracksAdapterResultsInterface } from '@fc/tracks-adapter-elasticsearch';

import {
  SecurityTicketDataInterface,
  TicketTracksDataInterface,
  TracksFormatterOutputInterface,
} from '../interfaces';
import { getReadableDateFromTime, getSecurityTicketData } from '../utils';

jest.mock('../utils/get-readable-date-from-time.util.ts');

const fraudCaseMock: FraudCaseDto = {
  id: 'fraudCaseIdMock',
  contactEmail: 'email@mock.fr',
  idpEmail: 'email@fi.fr',
  authenticationEventId: 'authenticationEventIdMock',
  fraudSurveyOrigin: 'fraudSurveyOriginMock',
  comment: 'commentMock',
  phoneNumber: 'phoneNumberMock',
};

const accountIdsMock = ['accountIdMock'];

const timeMock = 1664661600000;
const readableDateMock = '02/10/2022 00:00:00';

const trackWithAccountMatchMock: TracksFormatterOutputInterface = {
  platform: 'FranceConnect',
  city: 'Paris',
  country: 'FR',
  idpName: 'idpNameMock',
  idpId: 'idpIdMock',
  spName: 'spNameMock',
  spId: 'spIdMock',
  time: timeMock,
  accountId: 'accountIdMock',
  interactionAcr: 'interactionAcrMock',
  interactionId: 'interactionIdMock',
  browsingSessionId: 'browsingSessionIdMock',
  spSub: 'spSubMock',
  idpSub: 'idpSubMock',
  ipAddress: ['ipAddressMock'],
};

const trackWithoutAccountMatchMock: TracksFormatterOutputInterface = {
  platform: 'FranceConnect',
  city: 'Paris',
  country: 'FR',
  idpName: 'idpNameMock',
  idpId: 'idpIdMock',
  spName: 'spNameMock',
  spId: 'spIdMock',
  time: timeMock,
  accountId: 'invalidAccountIdMock',
  interactionAcr: 'interactionAcrMock',
  interactionId: 'interactionIdMock',
  browsingSessionId: 'browsingSessionIdMock',
  spSub: 'spSubMock',
  idpSub: 'idpSubMock',
  ipAddress: ['ipAddressMock'],
};

const tracksMock: TracksAdapterResultsInterface<TracksFormatterOutputInterface> =
  {
    total: 2,
    payload: [trackWithAccountMatchMock, trackWithoutAccountMatchMock],
  };

const identityMock: PivotIdentityDto = {
  given_name: 'firstName',
  family_name: 'lastName',
  birthdate: 'birthdate',
  gender: 'gender',
  birthplace: 'birthplace',
  birthcountry: 'birthcountry',
};

const ticketTrackWithAccountMatchMock: TicketTracksDataInterface = {
  city: 'Paris',
  country: 'FR',
  idpName: 'idpNameMock',
  platform: 'FranceConnect',
  spName: 'spNameMock',
  date: readableDateMock,
  accountIdMatch: true,
  interactionAcr: 'interactionAcrMock',
  spSub: 'spSubMock',
  idpSub: 'idpSubMock',
  ipAddress: ['ipAddressMock'],
};

const ticketTrackWithoutAccountMatchMock: TicketTracksDataInterface = {
  city: 'Paris',
  country: 'FR',
  idpName: 'idpNameMock',
  platform: 'FranceConnect',
  spName: 'spNameMock',
  date: readableDateMock,
  accountIdMatch: false,
  interactionAcr: 'interactionAcrMock',
  spSub: 'spSubMock',
  idpSub: 'idpSubMock',
  ipAddress: ['ipAddressMock'],
};

const ticketDataMock: SecurityTicketDataInterface = {
  fraudCaseId: 'fraudCaseIdMock',
  givenName: 'firstName',
  familyName: 'lastName',
  birthdate: 'birthdate',
  birthplace: 'birthplace',
  birthcountry: 'birthcountry',
  contactEmail: 'email@mock.fr',
  idpEmail: 'email@fi.fr',
  authenticationEventId: 'authenticationEventIdMock',
  fraudSurveyOrigin: 'fraudSurveyOriginMock',
  comment: 'commentMock',
  phoneNumber: 'phoneNumberMock',
  error: '',
  total: 2,
  tracks: [ticketTrackWithAccountMatchMock, ticketTrackWithoutAccountMatchMock],
};

describe('getSecurityTicketData', () => {
  beforeEach(() => {
    jest.mocked(getReadableDateFromTime).mockReturnValue(readableDateMock);
  });

  it('should call getReadableDateFromTime() with time', () => {
    // When
    getSecurityTicketData(
      identityMock,
      fraudCaseMock,
      accountIdsMock,
      tracksMock,
    );

    // Then
    expect(getReadableDateFromTime).toHaveBeenCalledTimes(2);
    expect(getReadableDateFromTime).toHaveBeenNthCalledWith(
      1,
      trackWithAccountMatchMock.time,
    );
    expect(getReadableDateFromTime).toHaveBeenNthCalledWith(
      2,
      trackWithoutAccountMatchMock.time,
    );
  });

  it('should return ticketData without error', () => {
    // When
    const ticketData = getSecurityTicketData(
      identityMock,
      fraudCaseMock,
      accountIdsMock,
      tracksMock,
    );

    // Then
    expect(ticketData).toEqual(ticketDataMock);
  });

  it('should return ticketData with error if accountIds list is empty', () => {
    // Given
    ticketDataMock.error =
      'impossible de récupérer les account ids à partir de l’identité de l’usager';
    ticketDataMock.tracks = [
      ticketTrackWithoutAccountMatchMock,
      ticketTrackWithoutAccountMatchMock,
    ];

    // When
    const ticketData = getSecurityTicketData(
      identityMock,
      fraudCaseMock,
      [],
      tracksMock,
    );

    // Then
    expect(ticketData).toEqual(ticketDataMock);
  });

  it('should return ticketData with error if tracks total is 0', () => {
    // Given
    ticketDataMock.error =
      'aucune trace ne correspond au code d’identitication';
    ticketDataMock.total = 0;
    ticketDataMock.tracks = [];

    // When
    const ticketData = getSecurityTicketData(
      identityMock,
      fraudCaseMock,
      accountIdsMock,
      { total: 0, payload: [] },
    );

    // Then
    expect(ticketData).toEqual(ticketDataMock);
  });
});
