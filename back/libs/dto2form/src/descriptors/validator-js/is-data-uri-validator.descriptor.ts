/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsDataURIValidator } from '../../interfaces';

export function $IsDataURI(): IsDataURIValidator {
  return { name: ValidatorJs.IS_DATA_URI };
}
