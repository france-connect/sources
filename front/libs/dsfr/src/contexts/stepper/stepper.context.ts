import React from 'react';

import type { StepperContextInterface } from '../../interfaces';
import type { StepperContextStepType } from '../../types';

export const StepperContext = React.createContext<StepperContextInterface>({
  currentStep: undefined as unknown as StepperContextStepType,
  gotoNextStep: () => {},
});
