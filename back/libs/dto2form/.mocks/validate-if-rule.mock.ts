import { FieldValidateIfRule } from '@fc/dto2form';

export function getValidateIfMock(name: string): FieldValidateIfRule {
  return {
    name,
    ruleArgs: [`${name}_rule_arg_1`, `${name}_rule_arg_2`],
  };
}
