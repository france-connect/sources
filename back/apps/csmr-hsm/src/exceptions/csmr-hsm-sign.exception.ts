import { ErrorCode } from '../enums';
import { CsmrHsmBaseException } from './csmr-hsm-base.exception';

export class CsmrHsmSignException extends CsmrHsmBaseException {
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la signature d'un token par le HSM. Contacter le support N3. Cette erreur n'est normalement pas remontée aux utilisateurs";
  static CODE = ErrorCode.HSM_SIGNATURE;
  static UI = 'CsmrHsm.exceptions.csmrHsmSign';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
