import { ValidatorCustom } from '../../enums';
import { IsSignedResponseAlgValidator } from '../../interfaces';

export function $IsSignedResponseAlg(): IsSignedResponseAlgValidator {
  return { name: ValidatorCustom.IS_SIGNED_RESPONSE_ALG };
}
