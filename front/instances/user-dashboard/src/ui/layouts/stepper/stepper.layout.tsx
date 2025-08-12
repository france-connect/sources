import React from 'react';
import { Outlet } from 'react-router';

import { ConfigService } from '@fc/config';
import type { StepperConfigInterface } from '@fc/dsfr';
import { Options, StepperContextProvider } from '@fc/dsfr';

export const StepperLayout = React.memo(() => {
  const config = ConfigService.get<StepperConfigInterface>(Options.CONFIG_NAME_STEPPER);

  return (
    <StepperContextProvider config={config}>
      <Outlet />
    </StepperContextProvider>
  );
});

StepperLayout.displayName = 'StepperLayout';
