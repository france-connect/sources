/* istanbul ignore file */

// declarative file
import { ValidateIfRule } from '../../enums';
import { IfDefinedValidateIfRule } from '../../interfaces';

export function $IfDefined(): IfDefinedValidateIfRule {
  return { name: ValidateIfRule.IF_DEFINED };
}
