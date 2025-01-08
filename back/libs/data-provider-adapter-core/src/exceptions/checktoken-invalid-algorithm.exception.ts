import { ErrorCode } from '../enums';
import { ChecktokenBaseException } from './checktoken-base.exception';

export class ChecktokenInvalidAlgorithmException extends ChecktokenBaseException {
  static CODE = ErrorCode.CHECKTOKEN_INVALID_ALGORYTHM;
  static DOCUMENTATION =
    "Un problème est survenu lors de l'appel au checktoken";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'DataProviderAdapterCore.exceptions.checktokenInvalidAlgorithm';
}
