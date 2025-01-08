import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

export class GetUserPreferencesConsumerErrorException extends UserPreferencesBaseException {
  static CODE = ErrorCode.GET_USER_PREFERENCES_CONSUMER_ERROR;
  static DOCUMENTATION =
    'Le consumer csmr-user-preferences a retourné un code erreur lors de la récupération des préférences utilisateur';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'UserPreferences.exceptions.getUserPreferencesConsumerError';
}
