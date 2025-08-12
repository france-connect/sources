import type { StepperContextStepType } from '../../types';

export interface StepperContextInterface {
  gotoNextStep: () => void;
  currentStep: StepperContextStepType;
}
