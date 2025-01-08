import { ValidatorJs } from '../../enums';
import { IsMimeTypeValidator } from '../../interfaces';

export function $IsMimeType(): IsMimeTypeValidator {
  return { name: ValidatorJs.IS_MIME_TYPE };
}
