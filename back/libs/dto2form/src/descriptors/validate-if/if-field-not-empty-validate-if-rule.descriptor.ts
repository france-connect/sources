import { ValidateIfRule } from '../../enums';
import { IfFieldNotEmptyValidateIfRule } from '../../interfaces';

export function $IfFieldNotEmpty(
  ...ruleArgs: IfFieldNotEmptyValidateIfRule['ruleArgs']
): IfFieldNotEmptyValidateIfRule {
  return { name: ValidateIfRule.IF_FIELD_NOT_EMPTY, ruleArgs };
}
