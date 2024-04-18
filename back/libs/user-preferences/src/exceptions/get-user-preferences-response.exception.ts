/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

@Description(
  "Une erreur s'est produite lors de la récupération des préferences utilisateur via le broker",
)
export class GetUserPreferencesResponseException extends UserPreferencesBaseException {
  code = ErrorCode.GET_USER_PREFERENCES_ERROR;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
