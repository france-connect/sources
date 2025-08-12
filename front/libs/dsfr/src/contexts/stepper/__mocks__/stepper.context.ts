import React from 'react';

export const StepperContext = React.createContext({
  currentStep: 0,
  gotoNextStep: () => {},
});
