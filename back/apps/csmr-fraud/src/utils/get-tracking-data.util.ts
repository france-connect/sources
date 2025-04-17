import { omit } from 'lodash';

import { AccountIdsResultsInterface } from '@fc/csmr-account-client';
import {
  AuthenticationEventDto,
  FraudCaseDto,
  TrackingDataDto,
} from '@fc/csmr-fraud-client';
import { TracksAdapterResultsInterface } from '@fc/tracks-adapter-elasticsearch';

import { TracksFormatterOutputInterface } from '../interfaces';

export function getTrackingData(
  fraudCase: FraudCaseDto,
  accountIds: AccountIdsResultsInterface,
  tracks: TracksAdapterResultsInterface<TracksFormatterOutputInterface>,
): TrackingDataDto {
  const { accountIdLow: userAccountIdLow, accountIdHigh: userAccountIdHigh } =
    accountIds;

  const { total: totalEvents, payload } = tracks;

  const { fraudCaseId, fraudSurveyOrigin, authenticationEventId } = fraudCase;

  const authenticationEvents = buildAuthenticationEvents(payload);

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
  tracks: TracksFormatterOutputInterface[],
): AuthenticationEventDto[] {
  const omitProperties = ['spSub', 'idpSub', 'interactionAcr'];

  const authenticationEvents: AuthenticationEventDto[] = tracks.map(
    (entry) =>
      ({
        ...omit(entry, omitProperties),
      }) as AuthenticationEventDto,
  );

  return authenticationEvents;
}
