import { useMemo } from 'react';
import { resolvePath } from 'react-router';

import type { StepperConfigStepType, StepperContextStepType } from '../../types';

interface UseStepperNavigationProps {
  pathname: string;
  steps: StepperConfigStepType[];
  basePath: string;
}

export const useStepper = ({
  basePath,
  pathname,
  steps,
}: UseStepperNavigationProps): {
  currentStep: StepperContextStepType | undefined;
} => {
  const resolvedSteps = useMemo(
    () =>
      steps.map((step, index) => ({
        ...step,
        index,
        resolvedPathname: resolvePath(step.path, basePath).pathname,
      })),
    [steps, basePath],
  );

  const currentStep = useMemo(() => {
    const matchingStep = resolvedSteps.find((step) => {
      const result = step.resolvedPathname === pathname;
      return result;
    });

    if (!matchingStep) {
      return undefined;
    }

    const nextStep = resolvedSteps.find((step) => {
      const result = step.index === matchingStep.index + 1;
      return result;
    });

    return {
      ...matchingStep,
      isLastStep: matchingStep.index === steps.length - 1,
      nextStepTitle: nextStep?.title,
    };
  }, [pathname, resolvedSteps, steps.length]);

  return { currentStep };
};
