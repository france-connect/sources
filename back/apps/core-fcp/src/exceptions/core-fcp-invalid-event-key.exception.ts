import { ErrorCode } from '../enums';
import { CoreFcpBaseException } from './core-fcp-base.exception';

export class CoreFcpInvalidEventKeyException extends CoreFcpBaseException {
  static CODE = ErrorCode.INVALID_CONSENT_PROCESS;
  static DOCUMENTATION =
    'La configuration du FS concernant le consentement demandé est incorrect ( un consentement est demandé sur une connexion anonyme, ... ). Contacter le support N3.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'CoreFcp.exceptions.coreFcpInvalidEventKey';
}
