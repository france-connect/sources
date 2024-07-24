import { useCallback, useEffect, useState } from 'react';

import type { UserPreferencesData } from '../interfaces';
import { checkHasDefaultConfiguration, checkSomeIdpHasBeenChangedSinceLoading } from '../utils';

interface useUserPreferencesFormProps {
  dirtyFields: Record<string, boolean>;
  userPreferences: UserPreferencesData;
}

export const useUserPreferencesForm = ({
  dirtyFields,
  userPreferences,
}: useUserPreferencesFormProps) => {
  const hasDefaultConfiguration = checkHasDefaultConfiguration(userPreferences);
  const someIdpHasBeenChangedSinceLoading = checkSomeIdpHasBeenChangedSinceLoading(dirtyFields);

  const [alertInfoState, setAlertInfoState] = useState({
    hasInteractedWithAlertInfo: false,
    isDisplayedAlertInfo: false,
  });

  const allowingIdPConfirmation = useCallback(() => {
    // @NOTE can not be mocked without a native re-implementation
    // istanbul ignore next
    setAlertInfoState((previous) => ({
      ...previous,
      hasInteractedWithAlertInfo: true,
      isDisplayedAlertInfo: false,
    }));
  }, [setAlertInfoState]);

  useEffect(() => {
    const shouldDisplayAlert =
      !alertInfoState.hasInteractedWithAlertInfo &&
      hasDefaultConfiguration &&
      someIdpHasBeenChangedSinceLoading;

    if (shouldDisplayAlert) {
      setAlertInfoState((previous) => ({
        ...previous,
        isDisplayedAlertInfo: true,
      }));
    }
  }, [
    someIdpHasBeenChangedSinceLoading,
    alertInfoState.hasInteractedWithAlertInfo,
    hasDefaultConfiguration,
  ]);

  return {
    alertInfoState,
    allowingIdPConfirmation,
  };
};
