import { ValidatorCustom } from '../enums';
import { FieldValidatorBase } from './field-validator.interface';

export interface CustomValidationOptionsBase {
  target: Record<string, unknown>;
}

/*
 ** IsFilledValidator
 */

export interface IsFilledValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_FILLED;
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

/*
 ** IsIpAddressesAndRangeValidator
 */

export interface IsIpAddressesAndRangeValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_IP_ADDRESSES_AND_RANGE;
}

/*
 ** IsSignedResponseAlgValidator
 */

export interface IsSignedResponseAlgValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_SIGNED_RESPONSE_ALG;
}

/*
 ** IsWebsiteURLValidator
 */

export interface IsWebsiteURLValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_WEBSITE_URL;
}

/*
 ** IsRedirectURLValidator
 */

export interface IsRedirectURLValidator extends FieldValidatorBase {
  name: ValidatorCustom.IS_REDIRECT_URL;
}
