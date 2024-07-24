/* istanbul ignore file */

// declarative file
export interface FieldValidateIfRuleBase {
  name: string;

  ruleArgs?: unknown[];
}

export interface FieldValidateIfRule extends FieldValidateIfRuleBase {}
