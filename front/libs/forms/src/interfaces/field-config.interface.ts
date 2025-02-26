import type { FieldValidator } from 'final-form';

import type { FieldTypes } from '../enums';
import type { InputConfigInterface } from './input-config.interface';

export interface FieldConfigInterface<FieldValue = string> extends InputConfigInterface {
  name: string;
  className?: string | undefined;
  type?: FieldTypes;
  validate?: FieldValidator<FieldValue> | undefined;
}
