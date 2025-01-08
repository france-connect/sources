import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

export class GetUserPreferencesResponseException extends UserPreferencesBaseException {
  static CODE = ErrorCode.GET_USER_PREFERENCES_ERROR;
  static DOCUMENTATION =
    "Une erreur s'est produite lors de la récupération des préferences utilisateur via le broker";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'UserPreferences.exceptions.getUserPreferencesResponse';
}
