import React from 'react';
import { useLocation } from 'react-router';

import { AlertComponent } from '@fc/dsfr';
import { useCleanupRouteState } from '@fc/routing';

import { PartnersAlertVariants } from '../../../enums';
import type { LocationWithSubmitStateInterface } from '../../../interfaces';

export const SandboxAlert = React.memo(() => {
  // @NOTE the location key changes on every navigation, it remounts the alert
  // so a repeated action moves the focus back onto the new message
  const { key } = useLocation();
  const { cleanupRouteState, state: submitState } =
    useCleanupRouteState<LocationWithSubmitStateInterface>();

  if (submitState?.variant !== PartnersAlertVariants.INSTANCE) {
    return null;
  }

  return (
    <AlertComponent
      key={key}
      autoFocus
      className="fr-mb-3w"
      dataTestId="service-provider-instance-alert"
      title={submitState.title}
      type={submitState.type}
      onClose={cleanupRouteState}>
      {submitState.message ?? ''}
    </AlertComponent>
  );
});

SandboxAlert.displayName = 'SandboxAlert';
