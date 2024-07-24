/* istanbul ignore file */

// declarative file
import { ValidateIfRule } from '../../enums';
import { IfFieldDefinedValidateIfRule } from '../../interfaces';

export function $IfFieldDefined(
  ...ruleArgs: IfFieldDefinedValidateIfRule['ruleArgs']
): IfFieldDefinedValidateIfRule {
  return { name: ValidateIfRule.IF_FIELD_DEFINED, ruleArgs };
}
