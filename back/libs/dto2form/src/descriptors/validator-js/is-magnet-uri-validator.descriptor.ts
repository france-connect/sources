/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsMagnetURIValidator } from '../../interfaces';

export function $IsMagnetURI(): IsMagnetURIValidator {
  return { name: ValidatorJs.IS_MAGNET_URI };
}
