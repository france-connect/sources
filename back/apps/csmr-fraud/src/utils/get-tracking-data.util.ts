import { omit } from 'lodash';

import { AccountIdsResultsInterface } from '@fc/csmr-account-client';
import {
  AuthenticationEventDto,
  FraudCaseDto,
  FraudTrackDto,
  TrackingDataDto,
} from '@fc/csmr-fraud-client';

export function getTrackingData(
  fraudCase: FraudCaseDto,
  accountIds: AccountIdsResultsInterface,
  fraudTracks: FraudTrackDto[],
): TrackingDataDto {
  const { accountIdLow: userAccountIdLow, accountIdHigh: userAccountIdHigh } =
    accountIds;

  const totalEvents = fraudTracks.length;

  const {
    id: fraudCaseId,
    fraudSurveyOrigin,
    authenticationEventId,
  } = fraudCase;

  const authenticationEvents = buildAuthenticationEvents(fraudTracks);

  const trackingData: TrackingDataDto = {
    fraudCaseId,
    userAccountIdLow,
    userAccountIdHigh,
    fraudSurveyOrigin,
    authenticationEventId,
    totalEvents,
    authenticationEvents,
  };

  return trackingData;
}

function buildAuthenticationEvents(
  tracks: FraudTrackDto[],
): AuthenticationEventDto[] {
  const omitProperties = [
    'spSub',
    'idpSub',
    'idpLabel',
    'interactionAcr',
    'date',
    'id',
  ];

  const authenticationEvents: AuthenticationEventDto[] = tracks.map(
    (entry) =>
      ({
        ...omit(entry, omitProperties),
      }) as AuthenticationEventDto,
  );

  return authenticationEvents;
}
