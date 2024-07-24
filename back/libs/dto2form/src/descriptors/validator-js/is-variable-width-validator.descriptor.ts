/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsVariableWidthValidator } from '../../interfaces';

export function $IsVariableWidth(): IsVariableWidthValidator {
  return { name: ValidatorJs.IS_VARIABLE_WIDTH };
}
