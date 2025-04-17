import {
  AuthenticationEventDto,
  FraudCaseDto,
  TrackingDataDto,
} from '@fc/csmr-fraud-client';
import { TracksAdapterResultsInterface } from '@fc/tracks-adapter-elasticsearch';

import { TracksFormatterOutputInterface } from '../interfaces';
import { getTrackingData } from './get-tracking-data.util';

const fraudCaseMock: FraudCaseDto = {
  fraudCaseId: 'fraudCaseIdMock',
  contactEmail: 'email@mock.fr',
  idpEmail: 'email@fi.fr',
  authenticationEventId: 'authenticationEventIdMock',
  fraudSurveyOrigin: 'fraudSurveyOriginMock',
  comment: 'commentMock',
  phoneNumber: 'phoneNumberMock',
};

const userAccountIdLowMock = 'userAccountIdLowMock';
const userAccountIdHighMock = 'userAccountIdHighMock';

const userAccountIdsMock = {
  accountIdLow: userAccountIdLowMock,
  accountIdHigh: userAccountIdHighMock,
};

const trackMock: TracksFormatterOutputInterface = {
  platform: 'FranceConnect',
  city: 'Paris',
  country: 'FR',
  idpName: 'idpNameMock',
  idpId: 'idpIdMock',
  spName: 'spNameMock',
  spId: 'spIdMock',
  time: 1664661600000,
  accountId: 'accountIdMock',
  interactionAcr: 'interactionAcrMock',
  interactionId: 'interactionIdMock',
  browsingSessionId: 'browsingSessionIdMock',
  spSub: 'spSubMock',
  idpSub: 'idpSubMock',
  ipAddress: ['ipAddressMock'],
};

const tracksMock: TracksAdapterResultsInterface<TracksFormatterOutputInterface> =
  {
    total: 1,
    payload: [trackMock],
  };

const authenticationEventMock: AuthenticationEventDto = {
  platform: 'FranceConnect',
  idpName: 'idpNameMock',
  idpId: 'idpIdMock',
  spName: 'spNameMock',
  spId: 'spIdMock',
  time: 1664661600000,
  accountId: 'accountIdMock',
  interactionId: 'interactionIdMock',
  browsingSessionId: 'browsingSessionIdMock',
  city: 'Paris',
  country: 'FR',
  ipAddress: ['ipAddressMock'],
};

const trackingDataMock: TrackingDataDto = {
  fraudCaseId: 'fraudCaseIdMock',
  userAccountIdLow: userAccountIdLowMock,
  userAccountIdHigh: userAccountIdHighMock,
  authenticationEventId: 'authenticationEventIdMock',
  fraudSurveyOrigin: 'fraudSurveyOriginMock',
  totalEvents: 1,
  authenticationEvents: [authenticationEventMock],
};

describe('getTrackingData', () => {
  it('should return trackingData with authenticationEvent', () => {
    // When
    const trackingData = getTrackingData(
      fraudCaseMock,
      userAccountIdsMock,
      tracksMock,
    );

    // Then
    expect(trackingData).toEqual(trackingDataMock);
  });

  it('should return trackingData without authenticationEvent', () => {
    // Given
    trackingDataMock.totalEvents = 0;
    trackingDataMock.authenticationEvents = [];

    // When
    const trackingData = getTrackingData(fraudCaseMock, userAccountIdsMock, {
      total: 0,
      payload: [],
    });

    // Then
    expect(trackingData).toEqual(trackingDataMock);
  });
});
