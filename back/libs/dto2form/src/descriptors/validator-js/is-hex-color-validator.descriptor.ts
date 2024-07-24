/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsHexColorValidator } from '../../interfaces';

export function $IsHexColor(): IsHexColorValidator {
  return { name: ValidatorJs.IS_HEX_COLOR };
}
