import { ValidatorJs } from '../../enums';
import { MatchesValidator } from '../../interfaces';

export function $Matches(
  ...validationArgs: MatchesValidator['validationArgs']
): MatchesValidator {
  return {
    name: ValidatorJs.MATCHES,
    validationArgs,
  };
}
