import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class CanNotImportJwkException extends JwtBaseException {
  static CODE = ErrorCode.CAN_NOT_IMPORT_JWK;
  static DOCUMENTATION = "Impossible d'importer le JWK";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Jwt.exceptions.canNotImportJwk';
}
