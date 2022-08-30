// Stryker disable all
/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

@Description(
  "Une erreur s'est produite lors de la récupération des préferences utilisateur via le broker",
)
export class GetUserPreferencesResponseException extends UserPreferencesBaseException {
  code = ErrorCode.GET_USER_PREFERENCES_ERROR;
}
