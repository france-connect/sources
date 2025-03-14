export interface FieldValidateIfRule {
  name: string;
  ruleArgs?: unknown[];
}

export interface FieldValidatorInterface {
  name: string;
  validationArgs?: unknown[];
  errorMessage: string;
}
