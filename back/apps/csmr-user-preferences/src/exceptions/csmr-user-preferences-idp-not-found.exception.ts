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
  message = "Le fournisseur d'identité en entrée est inconnu";
}
