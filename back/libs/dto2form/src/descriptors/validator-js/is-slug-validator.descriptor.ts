import { ValidatorJs } from '../../enums';
import { IsSlugValidator } from '../../interfaces';

export function $IsSlug(): IsSlugValidator {
  return { name: ValidatorJs.IS_SLUG };
}
