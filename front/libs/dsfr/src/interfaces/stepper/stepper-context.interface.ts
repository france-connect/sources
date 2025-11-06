import type { StepperContextStepType } from '../../types';

export interface StepperContextInterface {
  gotoNextStep: () => void;
  gotoPreviousStep: () => void;
  currentStep: StepperContextStepType;
}
