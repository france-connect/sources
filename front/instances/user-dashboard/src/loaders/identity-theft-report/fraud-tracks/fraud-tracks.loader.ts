import { ConfigService } from '@fc/config';
import type { FraudConfigInterface } from '@fc/core-user-dashboard';
import { FraudOptions } from '@fc/core-user-dashboard';
import { get } from '@fc/http-client';

import type { FraudTracksLoaderResponseInterface } from '../../../interfaces/fraud-tracks-loader-response.interface';

export const loadFraudTracks = async () => {
  const { apiRouteFraudGetTracks } = ConfigService.get<FraudConfigInterface>(
    FraudOptions.CONFIG_NAME,
  );

  // @NOTE If we decide to restrict access to this endpoint
  // to authenticated users in the future
  // we should replace 'get' with 'fetchWithAuthHandling'
  // @SEE libs/http-client/src/helpers/http-client.helper.ts
  const response = await get<FraudTracksLoaderResponseInterface>(apiRouteFraudGetTracks);

  return response;
};
