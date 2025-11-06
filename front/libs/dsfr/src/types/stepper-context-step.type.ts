import type { StepperConfigStepType } from './stepper-config-step.type';

export type StepperContextStepType = StepperConfigStepType & {
  index: number;
  isLastStep: boolean;
  nextStepTitle?: string;
};
