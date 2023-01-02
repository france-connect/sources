/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

@Description(
  "Une erreur s'est produite lors de la modification des préferences utilisateur via le broker",
)
export class SetUserPreferencesResponseException extends UserPreferencesBaseException {
  code = ErrorCode.SET_USER_PREFERENCES_ERROR;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
}
