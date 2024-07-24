/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsFQDNValidator } from '../../interfaces';

export function $IsFQDN(
  ...validationArgs: IsFQDNValidator['validationArgs']
): IsFQDNValidator {
  return {
    name: ValidatorJs.IS_FQDN,
    validationArgs,
  };
}
