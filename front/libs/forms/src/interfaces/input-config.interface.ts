import type { Sizes } from '@fc/dsfr';

import type { PropsWithHintType, PropsWithSeeAlsoType } from '../types';
import type { FieldMessage } from './field-message.interface';

export interface InputConfigInterface extends PropsWithHintType, PropsWithSeeAlsoType {
  label: string;
  size?: Sizes;
  inline?: boolean;
  maxChars?: number;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  messages?: FieldMessage[];
}
