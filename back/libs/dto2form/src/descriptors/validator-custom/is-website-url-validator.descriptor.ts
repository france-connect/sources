import { ValidatorCustom } from '../../enums';
import { IsWebsiteURLValidator } from '../../interfaces';

export function $IsWebsiteURL(): IsWebsiteURLValidator {
  return { name: ValidatorCustom.IS_WEBSITE_URL };
}
