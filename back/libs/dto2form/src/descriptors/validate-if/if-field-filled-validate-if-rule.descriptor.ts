import { ValidateIfRule } from '../../enums';
import { IfFieldFilledValidateIfRule } from '../../interfaces';

export function $IfFieldFilled(
  ...ruleArgs: IfFieldFilledValidateIfRule['ruleArgs']
): IfFieldFilledValidateIfRule {
  return { name: ValidateIfRule.IF_FIELD_FILLED, ruleArgs };
}
