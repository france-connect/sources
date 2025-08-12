import type { StepperContextStepType } from '../../../types';

export const useStepperNavigation = jest.fn(() => ({
  currentStep: {} as StepperContextStepType,
}));
