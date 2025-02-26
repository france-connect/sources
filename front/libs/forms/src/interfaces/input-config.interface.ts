import type { Sizes } from '@fc/dsfr';

import type { PropsWithHintType } from '../types';

export interface InputConfigInterface extends PropsWithHintType {
  label: string;
  size?: Sizes;
  inline?: boolean;
  maxChars?: number;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
}
