import { useCallback } from 'react';

import type { MessageTypes } from '@fc/common';
import { RoutePaths, useNavigateWithState } from '@fc/routing';

import type { PartnersAlertVariants } from '../../enums';

export const useDeletionNotifier = (variant: PartnersAlertVariants) => {
  const { navigateWithState } = useNavigateWithState();

  const notifyDeletion = useCallback(
    (message: string, title: string, type: MessageTypes) => {
      navigateWithState(RoutePaths.CURRENT, { message, title, type, variant }, true);
    },
    [navigateWithState, variant],
  );

  return { notifyDeletion };
};
