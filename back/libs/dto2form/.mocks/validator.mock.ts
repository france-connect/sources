import { FieldValidator } from '@fc/dto2form';

export function getValidatorMock(name: string): FieldValidator {
  return {
    name,
    errorLabel: `${name}_error_label`,
    validationArgs: [`${name}_validation_arg_1`, `${name}_validation_arg_2`],
  };
}
