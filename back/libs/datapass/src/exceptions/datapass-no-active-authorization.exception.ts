import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassNoActiveAuthorizationException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_NO_ACTIVE_AUTHORIZATION;
  static DOCUMENTATION =
    'Aucune autorisation Datapass active trouvée pour FranceConnect';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'No active Datapass authorization found for FranceConnect';
  static UI = 'Datapass.exceptions.noActiveAuthorization';
}
