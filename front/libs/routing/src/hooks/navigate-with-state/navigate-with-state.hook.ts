import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import type { AnyObjectInterface } from '@fc/common';
import { MessageTypes } from '@fc/common';

import { RoutePaths } from '../../enums';
import type { LocationStateInterface, LocationWithTypeStateInterface } from '../../interfaces';

export const useNavigateWithState = () => {
  const navigate = useNavigate();

  const navigateWithState = useCallback(
    <T extends LocationStateInterface>(path: string, state: T, replace: boolean) =>
      navigate(path, {
        replace,
        state,
      }),
    [navigate],
  );

  const goBack = useCallback(
    (replace = false) => navigate(RoutePaths.PREVIOUS, { replace }),
    [navigate],
  );

  const goBackWithSuccess = useCallback(
    (obj: AnyObjectInterface, replace = true) => {
      const state = { ...obj, type: MessageTypes.SUCCESS };
      return navigateWithState<LocationWithTypeStateInterface>(RoutePaths.PREVIOUS, state, replace);
    },
    [navigateWithState],
  );

  const goBackWithError = useCallback(
    (obj: AnyObjectInterface, replace = true) => {
      const state = { ...obj, type: MessageTypes.ERROR };
      return navigateWithState<LocationWithTypeStateInterface>(RoutePaths.PREVIOUS, state, replace);
    },
    [navigateWithState],
  );

  return { goBack, goBackWithError, goBackWithSuccess, navigateWithState };
};
