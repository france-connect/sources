import { FieldMessage } from '../dto';

export interface FieldValidatorBase {
  name: string;

  validationArgs?: unknown[];
}

export interface FieldValidator extends FieldValidatorBase {
  errorMessage: FieldMessage;
}
