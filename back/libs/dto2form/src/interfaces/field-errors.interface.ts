import { FieldValidator } from './field-validator.interface';

export interface FieldErrorsInterface {
  name: string;
  validators: (FieldValidator | FieldValidator[])[];
}
