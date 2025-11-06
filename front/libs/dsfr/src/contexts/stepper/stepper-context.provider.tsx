import type { PropsWithChildren } from 'react';
import React from 'react';
import { useLocation } from 'react-router';

import { HeadingTag, sortByKey } from '@fc/common';

import { StepperComponent } from '../../components';
import { useStepper, useStepperNavigateTo } from '../../hooks';
import type { StepperConfigInterface } from '../../interfaces';
import { StepperContext } from './stepper.context';

interface StepperContextProviderProps extends Required<PropsWithChildren> {
  config: StepperConfigInterface;
}

export const StepperContextProvider = ({ children, config }: StepperContextProviderProps) => {
  const { pathname } = useLocation();

  const orderedSteps = [...config.steps].sort(sortByKey('order'));

  const { currentStep } = useStepper({
    basePath: config.basePath,
    pathname,
    steps: orderedSteps,
  });

  const { gotoNextStep, gotoPreviousStep } = useStepperNavigateTo({
    basePath: config.basePath,
    currentStep,
    steps: orderedSteps,
  });

  if (!currentStep) {
    return null;
  }

  return (
    <React.Fragment>
      <StepperComponent
        heading={HeadingTag.H6}
        nextStepTitle={currentStep.nextStepTitle}
        stepNumber={currentStep.index + 1}
        stepTitle={currentStep.title}
        totalSteps={orderedSteps.length}
      />
      <StepperContext.Provider
        value={{
          currentStep,
          gotoNextStep,
          gotoPreviousStep,
        }}>
        {children}
      </StepperContext.Provider>
    </React.Fragment>
  );
};
