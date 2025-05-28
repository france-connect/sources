import type { ChoiceInterface, FieldTypes, PropsWithHintType } from '@fc/forms';

import type { FieldValidateIfRule, FieldValidatorInterface } from './field-validator.interface';

export interface BaseAttributes {
  type: string;
  name: string;
  label: string;
  order: number;
}

export interface FieldAttributes extends BaseAttributes, PropsWithHintType {
  // @TODO this should be refactored
  type: FieldTypes;
  required: boolean;
  readonly: boolean;

  value?: string;
  inline?: boolean;
  maxChars?: number;
  disabled?: boolean;
  initialValue?: string | string[];
  validateIf?: FieldValidateIfRule[];
  options?: ChoiceInterface[];

  /*
   ** Use ArrayField component
   */
  array?: boolean;

  /*
   ** Should at least have one validator (better safe than sorry ;D)
   */
  validators: [FieldValidatorInterface, ...FieldValidatorInterface[]];
}

export interface SelectAttributes extends FieldAttributes {
  type: FieldTypes.SELECT;
  options: ChoiceInterface[];
}

// @NOTE keep it as an independent type
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SectionAttributes extends BaseAttributes {}
