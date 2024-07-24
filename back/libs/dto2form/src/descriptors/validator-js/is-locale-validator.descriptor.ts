/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsLocaleValidator } from '../../interfaces';

export function $IsLocale(): IsLocaleValidator {
  return { name: ValidatorJs.IS_LOCALE };
}
