import type { PropsWithChildren } from 'react';
import React, { useCallback } from 'react';
import { resolvePath, useLocation, useNavigate } from 'react-router';

import { HeadingTag, sortByKey } from '@fc/common';

import { StepperComponent } from '../../components';
import { useStepperNavigation } from '../../hooks';
import type { StepperConfigInterface } from '../../interfaces';
import { StepperContext } from './stepper.context';

interface StepperContextProviderProps extends Required<PropsWithChildren> {
  config: StepperConfigInterface;
}

export const StepperContextProvider = ({ children, config }: StepperContextProviderProps) => {
  const navigate = useNavigate();

  const { pathname } = useLocation();

  const orderedSteps = [...config.steps].sort(sortByKey('order'));

  const { currentStep } = useStepperNavigation({
    basePath: config.basePath,
    pathname,
    steps: orderedSteps,
  });

  const gotoNextStep = useCallback(() => {
    // @NOTE
    // currentStep is always defined if the user can click the button
    // if currentStep is undefined, the button is not mounted
    const nextIndex = currentStep!.order;
    const step = orderedSteps[nextIndex];
    const path = resolvePath(step.path, config.basePath);
    navigate(path);
  }, [config.basePath, currentStep, navigate, orderedSteps]);

  if (!currentStep) {
    return null;
  }

  return (
    <React.Fragment>
      <StepperComponent
        currentStep={currentStep.order}
        currentStepTitle={currentStep.title}
        heading={HeadingTag.H6}
        nextStepTitle={currentStep.nextStepTitle}
        totalSteps={orderedSteps.length}
      />
      <StepperContext.Provider value={{ currentStep, gotoNextStep }}>
        {children}
      </StepperContext.Provider>
    </React.Fragment>
  );
};
