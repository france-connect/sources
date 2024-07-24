/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsEthereumAddressValidator } from '../../interfaces';

export function $IsEthereumAddress(): IsEthereumAddressValidator {
  return { name: ValidatorJs.IS_ETHEREUM_ADDRESS };
}
