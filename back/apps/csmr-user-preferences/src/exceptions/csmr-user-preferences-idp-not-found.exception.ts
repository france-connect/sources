/* istanbul ignore file */

// Declarative code
import { ErrorCode } from '../enums';
import { CsmrUserPreferencesBaseException } from './csmr-user-preferences-base.exception';

export class CsmrUserPreferencesIdpNotFoundException extends CsmrUserPreferencesBaseException {
  static CODE = ErrorCode.IDP_NOT_FOUND;
  static DOCUMENTATION =
    "Le fournisseur d'identité en entrée n'existe pas dans la liste des idp";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'CsmrUserPreferences.exceptions.csmrUserPreferencesIdpNotFound';
}
