/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { AccessControlBaseException } from './access-control-base.exception';

@Description(
  "le rôle demandé est inconnu. Merci de vérifier la liste des droits de l'utilisateur",
)
export class UnknownPermissionException extends AccessControlBaseException {
  public readonly code = ErrorCode.UNKNOWN_PERMISSION;
  public readonly message = "Rôle inconnu associé à l'utilisateur";
}
