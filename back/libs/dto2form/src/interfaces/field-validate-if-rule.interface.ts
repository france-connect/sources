export interface FieldValidateIfRuleBase {
  name: string;

  ruleArgs?: unknown[];
}

// Kept to prevent re-typing everything in the future if we need to add more parameters
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FieldValidateIfRule extends FieldValidateIfRuleBase {}
