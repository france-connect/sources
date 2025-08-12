import type { StepperConfigStepType } from './stepper-config-step.type';

export type StepperContextStepType = StepperConfigStepType & {
  isLastStep: boolean;
  nextStepTitle?: string;
};
