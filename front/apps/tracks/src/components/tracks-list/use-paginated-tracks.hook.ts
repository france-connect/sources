import type { AxiosError, AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ConfigService } from '@fc/config';
import { get } from '@fc/http-client';

import { Options } from '../../enums';
import type { TracksConfig, UserDashboardTracks } from '../../interfaces';

export const DEFAULT_SIZE = '10';
export const DEFAULT_OFFSET = '0';

export const usePaginatedTracks = () => {
  const {
    endpoints: { tracks: tracksEndpoint },
  } = ConfigService.get<TracksConfig>(Options.CONFIG_NAME);

  const { search } = useLocation();
  const [tracks, setTracks] = useState<UserDashboardTracks>({} as UserDashboardTracks);
  const [submitErrors, setSubmitErrors] = useState<AxiosError | Error | undefined>(undefined);

  const getTacksSuccessHandler = useCallback(({ data }: Pick<AxiosResponse, 'data'>) => {
    setTracks(data);
    setSubmitErrors(undefined);
  }, []);

  /**
   * @TODO Add retry and logout process here
   */
  const getTacksErrorHandler = useCallback((error: unknown) => {
    setSubmitErrors(error as AxiosError | Error);
  }, []);

  const getTracks = useCallback(() => {
    const query = new URLSearchParams(search);
    const qs = new URLSearchParams({
      offset: query.get('offset') || DEFAULT_OFFSET,
      size: query.get('size') || DEFAULT_SIZE,
    });

    const endpoint = `${tracksEndpoint}?${qs.toString()}`;

    return get<UserDashboardTracks>(endpoint)
      .then(getTacksSuccessHandler)
      .catch(getTacksErrorHandler);
  }, [tracksEndpoint, search, getTacksErrorHandler, getTacksSuccessHandler]);

  useEffect(() => {
    getTracks();
  }, [search, getTracks]);

  return { submitErrors, tracks };
};
