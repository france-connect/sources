/* istanbul ignore file */

// declarative file
import { ValidatorJs } from '../../enums';
import { IsIPValidator } from '../../interfaces';

export function $IsIP(
  ...validationArgs: IsIPValidator['validationArgs']
): IsIPValidator {
  return { name: ValidatorJs.IS_IP, validationArgs };
}
