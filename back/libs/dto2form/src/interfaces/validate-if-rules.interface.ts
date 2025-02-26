import { ValidateIfRule } from '../enums';
import { FieldValidateIfRuleBase } from './field-validate-if-rule.interface';

/*
 ** IsDefinedValidateIfRule
 */

export interface IfDefinedValidateIfRule extends FieldValidateIfRuleBase {
  name: ValidateIfRule.IF_DEFINED;
}

/*
 ** IsNotEmptyValidateIfRule
 */

export interface IfNotEmptyValidateIfRule extends FieldValidateIfRuleBase {
  name: ValidateIfRule.IF_NOT_EMPTY;
}

/*
 ** IfFieldFilledValidateIfRule
 */

export interface IfFieldFilledValidateIfRule extends FieldValidateIfRuleBase {
  name: ValidateIfRule.IF_FIELD_FILLED;
  ruleArgs: [field: string];
}

/*
 ** IfFieldDefinedValidateIfRule
 */

export interface IfFieldDefinedValidateIfRule extends FieldValidateIfRuleBase {
  name: ValidateIfRule.IF_FIELD_DEFINED;
  ruleArgs: [field: string];
}

/*
 ** IfFieldNotEmptyValidateIfRule
 */

export interface IfFieldNotEmptyValidateIfRule extends FieldValidateIfRuleBase {
  name: ValidateIfRule.IF_FIELD_NOT_EMPTY;
  ruleArgs: [field: string];
}
