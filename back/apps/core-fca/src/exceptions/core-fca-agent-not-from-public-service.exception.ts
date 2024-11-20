/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@fc/core';

import { CoreFcaBaseException } from './core-fca-base.exception';

export class CoreFcaAgentNotFromPublicServiceException extends CoreFcaBaseException {
  static DOCUMENTATION =
    "L'utilisateur renseigné n'est pas reconnu comme dépendant du service public";
  static CODE = ErrorCode.AGENT_NOT_FOUND;
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'authentication aborted due to invalid identity';

  public illustration = 'access-restricted-error';
  public title = 'Accès impossible';
  public description =
    "Seuls les agents et agentes de la fonction publique de l'État et de ses opérateurs sont autorisées à se connecter via ProConnect.";

  public displayContact = true;
  public contactMessage =
    'Si cette situation vous parait inhabituelle, vous pouvez nous signaler l’erreur.';
}
