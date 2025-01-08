import type { Sizes } from '@fc/dsfr';

import type { PropsWithHintType } from '../types';

export interface ChoiceInterface extends PropsWithHintType {
  label: string;
  value: string;
}

export interface InputConfigInterface extends PropsWithHintType {
  label: string;
  size?: Sizes;
  inline?: boolean;
  maxChars?: number;
  disabled?: boolean;
  required?: boolean;
  clipboardDisabled?: boolean;
}
