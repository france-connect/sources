import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassApiResponseValidationException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_API_RESPONSE_VALIDATION_FAILED;
  static DOCUMENTATION =
    "La réponse de l'API Datapass ne contient pas les champs requis";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'Datapass API response validation failed';
  static UI = 'Datapass.exceptions.apiResponseValidationFailed';
}
