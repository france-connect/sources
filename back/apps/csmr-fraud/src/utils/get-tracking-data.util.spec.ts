import {
  AuthenticationEventDto,
  FraudCaseDto,
  FraudTrackDto,
  TrackingDataDto,
} from '@fc/csmr-fraud-client';

import { getTrackingData } from './get-tracking-data.util';

const fraudCaseMock: FraudCaseDto = {
  id: 'fraudCaseIdMock',
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

const timeMock = 1664661600000;
const readableDateMock = '02/10/2022 00:00:00';

const trackMock: FraudTrackDto = {
  id: 'idMock',
  platform: 'FranceConnect',
  city: 'Paris',
  country: 'FR',
  idpName: 'idpNameMock',
  idpLabel: 'idpLabelMock',
  idpId: 'idpIdMock',
  spName: 'spNameMock',
  spId: 'spIdMock',
  time: timeMock,
  date: readableDateMock,
  accountId: 'accountIdMock',
  interactionAcr: 'interactionAcrMock',
  interactionId: 'interactionIdMock',
  browsingSessionId: 'browsingSessionIdMock',
  spSub: 'spSubMock',
  idpSub: 'idpSubMock',
  ipAddress: ['ipAddressMock'],
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
    const trackingData = getTrackingData(fraudCaseMock, userAccountIdsMock, [
      trackMock,
    ]);

    // Then
    expect(trackingData).toEqual(trackingDataMock);
  });

  it('should return trackingData with authenticationEvent even if accountId are undefined', () => {
    // Given
    const trackingUnknownDataMock: TrackingDataDto = {
      fraudCaseId: 'fraudCaseIdMock',
      userAccountIdLow: undefined,
      userAccountIdHigh: undefined,
      authenticationEventId: 'authenticationEventIdMock',
      fraudSurveyOrigin: 'fraudSurveyOriginMock',
      totalEvents: 1,
      authenticationEvents: [authenticationEventMock],
    };

    // When
    const trackingData = getTrackingData(fraudCaseMock, {}, [trackMock]);

    // Then
    expect(trackingData).toEqual(trackingUnknownDataMock);
  });

  it('should return trackingData without authenticationEvent', () => {
    // Given
    trackingDataMock.totalEvents = 0;
    trackingDataMock.authenticationEvents = [];

    // When
    const trackingData = getTrackingData(fraudCaseMock, userAccountIdsMock, []);

    // Then
    expect(trackingData).toEqual(trackingDataMock);
  });
});
