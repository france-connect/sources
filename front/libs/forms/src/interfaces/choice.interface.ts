import type { PropsWithHintType } from '../types';

export interface ChoiceInterface extends PropsWithHintType {
  label: string;
  value: string;
  disabled?: boolean;
}
