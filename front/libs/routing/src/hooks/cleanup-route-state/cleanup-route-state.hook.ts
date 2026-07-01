import { useCallback } from 'react';
import type { Location } from 'react-router';
import { useLocation, useNavigate } from 'react-router';

import { RoutePaths } from '../../enums';
import type { LocationStateInterface } from '../../interfaces';

export const useCleanupRouteState = <T extends LocationStateInterface = { from: undefined }>(): {
  cleanupRouteState: () => void;
  state: T | undefined;
} => {
  const navigate = useNavigate();
  const { state } = useLocation() as Location<T>;

  const cleanupRouteState = useCallback(() => {
    if (!state) {
      // @NOTE if the state is not defined => do not navigate
      return;
    }

    // @NOTE
    // reload the page without the submit state
    // act like any URL with a search query `?<key>=<value>&`
    // do not replace the current entry in the history stack
    navigate(RoutePaths.CURRENT, {
      replace: false,
      state: undefined,
    });
  }, [navigate, state]);

  return { cleanupRouteState, state };
};
