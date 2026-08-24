import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassApiHttpException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_API_HTTP_FAILED;
  static DOCUMENTATION = 'Échec de la requête HTTP vers l’API Datapass.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'Datapass API HTTP request failed';
  static UI = 'Datapass.exceptions.apiHttpFailed';
}
