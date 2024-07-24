/* istanbul ignore file */

// Declarative code
import { FieldValidateIfRule } from './field-validate-if-rule.interface';
import {
  FieldValidator,
  FieldValidatorBase,
} from './field-validator.interface';

export interface FieldAttributesArguments {
  type?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;

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
  label: string;
  required: boolean;

  /*
   ** Should at least have one validator (better safe than sorry ;D)
   */
  validators: [FieldValidator, ...FieldValidator[]];
}
