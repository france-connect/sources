/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsMACAddressValidator } from '../../interfaces';

export function $IsMACAddress(
  ...validationArgs: IsMACAddressValidator['validationArgs']
): IsMACAddressValidator {
  return { name: ValidatorJs.IS_MAC_ADDRESS, validationArgs };
}
