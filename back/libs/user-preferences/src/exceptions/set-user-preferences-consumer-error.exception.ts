/* istanbul ignore file */

// declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { UserPreferencesBaseException } from './user-preferences-base-exception';

@Description(
  'Le consumer csmr-user-preferences a retourné un code erreur lors de la modification des préferences utilisateur',
)
export class SetUserPreferencesConsumerErrorException extends UserPreferencesBaseException {
  code = ErrorCode.SET_USER_PREFERENCES_CONSUMER_ERROR;
  message =
    "Une erreur technique s'est produite, merci de réessayer ultérieurement.";
}
