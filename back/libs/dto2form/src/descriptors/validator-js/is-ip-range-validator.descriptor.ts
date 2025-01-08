import { ValidatorJs } from '../../enums';
import { IsIPRangeValidator } from '../../interfaces';

export function $IsIPRange(
  ...validationArgs: IsIPRangeValidator['validationArgs']
): IsIPRangeValidator {
  return {
    name: ValidatorJs.IS_IP_RANGE,
    validationArgs,
  };
}
