import { useCallback } from 'react';
import { resolvePath, useNavigate } from 'react-router';

import type { StepperConfigStepType, StepperContextStepType } from '../../types';

export const useStepperNavigateTo = ({
  basePath,
  currentStep,
  steps,
}: {
  steps: StepperConfigStepType[];
  basePath: string;
  currentStep: StepperContextStepType | undefined;
}) => {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (step: StepperConfigStepType) => {
      const path = resolvePath(step.path, basePath);
      navigate(path);
    },
    [basePath, navigate],
  );

  const gotoNextStep = useCallback(() => {
    if (!currentStep || currentStep.index >= steps.length - 1) {
      return;
    }
    // @NOTE
    // currentStep is always defined if the user can click the button
    // if currentStep is undefined, the button is not mounted
    const nextIndex = currentStep.index + 1;
    const step = steps[nextIndex];
    navigateTo(step);
  }, [currentStep, navigateTo, steps]);

  const gotoPreviousStep = useCallback(() => {
    if (!currentStep || currentStep.index === 0) {
      return;
    }
    // @NOTE
    // currentStep is always defined if the user can click the button
    // if currentStep is undefined, the button is not mounted
    const nextIndex = currentStep.index - 1;
    const step = steps[nextIndex];
    navigateTo(step);
  }, [currentStep, navigateTo, steps]);

  return { gotoNextStep, gotoPreviousStep, navigateTo };
};
