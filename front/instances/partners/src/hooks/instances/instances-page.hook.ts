import { useCallback } from 'react';
import { useLoaderData, useLocation, useNavigate } from 'react-router';

import type { LocationWithSubmitStateType } from '../../types';

export const useInstances = () => {
  const navigate = useNavigate();
  const location = useLocation() as LocationWithSubmitStateType;
  const response = useLoaderData();

  const closeAlertHandler = useCallback(() => {
    // @NOTE onCloseAlert
    // reload the page without the submit state
    // act like any URL with a search query `?<key>=<value>&`
    // do not replace the current entry in the history stack
    navigate('.', { replace: false, state: undefined });
  }, [navigate]);

  const { payload } = response;
  const hasItems = !!(payload && payload.length);

  const submitState = location.state?.submitState || undefined;

  return { closeAlertHandler, hasItems, items: payload, submitState };
};
