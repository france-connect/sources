/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsHSLValidator } from '../../interfaces';

export function $IsHSL(): IsHSLValidator {
  return { name: ValidatorJs.IS_HSL };
}
