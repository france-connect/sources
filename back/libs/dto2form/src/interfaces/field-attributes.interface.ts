import { OptionsAttributesInterface } from './choice-attributes.interface';
import { FieldValidateIfRule } from './field-validate-if-rule.interface';
import {
  FieldValidator,
  FieldValidatorBase,
} from './field-validator.interface';

export interface FieldAttributesArguments {
  type?: string;
  initialValue?: string | string[];
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  array?: boolean;
  /*
   ** Should at least have one option
   */
  options?: [OptionsAttributesInterface, ...OptionsAttributesInterface[]];
  inline?: boolean;
  order?: number;

  validateIf?: FieldValidateIfRule[];
  /*
   ** Should at least have one validator (better safe than sorry ;D)
   */
  validators: [FieldValidatorBase, ...FieldValidatorBase[]];
}

export interface FieldAttributes extends FieldAttributesArguments {
  type: string;
  name: string;
  required: boolean;
  readonly: boolean;
  array: boolean;
  initialValue: string | string[];

  /*
   ** Should at least have one validator (better safe than sorry ;D)
   */
  validators: [FieldValidator, ...FieldValidator[]];
}
