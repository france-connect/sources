import { FieldAttributes } from '@fc/dto2form';
import { getValidateIfMock } from './validate-if-rule.mock';
import { getValidatorMock } from './validator.mock';

export function getFieldAttributesMock(
  name: string,
  required = true,
  array = false,
  readonly = false,
): FieldAttributes {
  return {
    name,
    type: 'text',
    required,
    array,
    readonly,
    initialValue: '',
    validateIf: [
      getValidateIfMock(`${name}_validate_if_rule_1`),
      getValidateIfMock(`${name}_validate_if_rule_2`),
    ],
    validators: [
      getValidatorMock(`${name}_validator_1`),
      getValidatorMock(`${name}_validator_2`),
    ],
  };
}
