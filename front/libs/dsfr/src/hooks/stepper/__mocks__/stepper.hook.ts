import type { StepperContextStepType } from '../../../types';

export const useStepper = jest.fn(() => ({
  currentStep: {} as StepperContextStepType,
}));
