/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsBtcAddressValidator } from '../../interfaces';

export function $IsBtcAddress(): IsBtcAddressValidator {
  return { name: ValidatorJs.IS_BTC_ADDRESS };
}
