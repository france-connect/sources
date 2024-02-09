/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CsmrUserPreferencesBaseException } from './csmr-user-preferences-base.exception';

@Description(
  "Le fournisseur d'identité en entrée n'existe pas dans la liste des idp",
)
export class CsmrUserPreferencesIdpNotFoundException extends CsmrUserPreferencesBaseException {
  code = ErrorCode.IDP_NOT_FOUND;
  message =
    'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
