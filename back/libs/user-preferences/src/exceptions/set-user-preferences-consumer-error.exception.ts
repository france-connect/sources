/* istanbul ignore file */

// declarative file
import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

export class SetUserPreferencesConsumerErrorException extends UserPreferencesBaseException {
  static CODE = ErrorCode.SET_USER_PREFERENCES_CONSUMER_ERROR;
  static DOCUMENTATION =
    'Le consumer csmr-user-preferences a retourné un code erreur lors de la modification des préferences utilisateur';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'UserPreferences.exceptions.setUserPreferencesConsumerError';
}
