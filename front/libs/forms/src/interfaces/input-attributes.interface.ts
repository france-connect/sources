import type { FormatterType, ValidatorType } from '../types';

export interface InputAttributesInterface<FieldValue = unknown, InputValue = FieldValue> {
  name: string;
  className?: string | undefined;
  validate?: ValidatorType<FieldValue> | undefined;
  format?: FormatterType<FieldValue, InputValue> | undefined;
}
