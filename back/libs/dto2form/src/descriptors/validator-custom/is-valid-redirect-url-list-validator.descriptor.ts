import { ValidatorCustom } from '../../enums';
import { isValidRedirectURLListValidator } from '../../interfaces';

export function $IsValidRedirectURLList(): isValidRedirectURLListValidator {
  return { name: ValidatorCustom.IS_VALID_REDIRECT_URL_LIST };
}
