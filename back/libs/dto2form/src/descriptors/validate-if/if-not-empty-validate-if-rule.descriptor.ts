/* istanbul ignore file */

// declarative file
import { ValidateIfRule } from '../../enums';
import { IfNotEmptyValidateIfRule } from '../../interfaces';

export function $IfNotEmpty(): IfNotEmptyValidateIfRule {
  return { name: ValidateIfRule.IF_NOT_EMPTY };
}
