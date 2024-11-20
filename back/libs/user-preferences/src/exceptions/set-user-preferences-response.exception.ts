/* istanbul ignore file */

// declarative file
import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

export class SetUserPreferencesResponseException extends UserPreferencesBaseException {
  static CODE = ErrorCode.SET_USER_PREFERENCES_ERROR;
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la modification des préferences utilisateur via le broker";
  static UI = 'UserPreferences.exceptions.setUserPreferencesResponse';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
