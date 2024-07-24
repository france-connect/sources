/* istanbul ignore file */

// Declarative code
export interface FieldValidatorBase {
  name: string;

  validationArgs?: unknown[];
}

export interface FieldValidator extends FieldValidatorBase {
  errorLabel: string;
}
