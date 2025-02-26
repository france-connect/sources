import { ValidatorCustom } from '../../enums';
import { IsRedirectURLValidator } from '../../interfaces';

export function $IsRedirectURL(): IsRedirectURLValidator {
  return { name: ValidatorCustom.IS_REDIRECT_URL };
}
