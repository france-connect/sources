/* istanbul ignore file */

// declarative file
import { ValidatorCustom } from '../enums';
import { FieldValidatorBase } from './field-validator.interface';

export interface CustomValidationOptionsBase {
  target: Record<string, unknown>;
}

/*
 ** IsStringValidator
 */

export interface IsStringValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_STRING;
}

/*
 ** IsNotEmptyValidator
 */

export interface IsNotEmptyValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_NOT_EMPTY;
}
