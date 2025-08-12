import { useMemo } from 'react';
import { resolvePath } from 'react-router';

import type { StepperConfigStepType } from '../../types';

interface UseStepperNavigationProps {
  pathname: string;
  steps: StepperConfigStepType[];
  basePath: string;
}

export const useStepperNavigation = ({ basePath, pathname, steps }: UseStepperNavigationProps) => {
  const resolvedSteps = useMemo(
    () =>
      steps.map((step) => ({
        ...step,
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
      const result = step.order === matchingStep.order + 1;
      return result;
    });

    return {
      ...matchingStep,
      isLastStep: matchingStep.order === steps.length,
      nextStepTitle: nextStep?.title,
    };
  }, [pathname, resolvedSteps, steps.length]);

  return { currentStep };
};
