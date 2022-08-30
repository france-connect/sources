import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { TracksConfig, UserDashboardTracks } from '../../interfaces';

export const DEFAULT_SIZE = '10';
export const DEFAULT_OFFSET = '0';

export const usePaginatedTracks = (options: TracksConfig) => {
  const { search } = useLocation();
  const [tracks, setTracks] = useState<UserDashboardTracks>({} as UserDashboardTracks);
  const [submitErrors, setSubmitErrors] = useState(undefined);

  const getTacksSuccessHandler = useCallback(({ data }) => {
    setTracks(data);
    setSubmitErrors(undefined);
  }, []);

  /**
   * @TODO Add retry and logout process here
   */
  const getTacksErrorHandler = useCallback((error) => {
    setSubmitErrors(error);
  }, []);

  const getTracks = useCallback(() => {
    const query = new URLSearchParams(search);
    const qs = new URLSearchParams({
      offset: query.get('offset') || DEFAULT_OFFSET,
      size: query.get('size') || DEFAULT_SIZE,
    });

    const endpoint = `${options.API_ROUTE_TRACKS}?${qs.toString()}`;

    return axios
      .get<UserDashboardTracks>(endpoint)
      .then(getTacksSuccessHandler)
      .catch(getTacksErrorHandler);
  }, [options.API_ROUTE_TRACKS, search, getTacksErrorHandler, getTacksSuccessHandler]);

  useEffect(() => {
    getTracks();
  }, [options, search, getTracks]);

  return { submitErrors, tracks };
};