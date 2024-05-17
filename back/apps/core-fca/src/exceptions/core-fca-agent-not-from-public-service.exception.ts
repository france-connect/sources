/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';

import { CoreFcaBaseException } from './core-fca-base.exception';

@Description(
  "L'utilisateur renseigné n'est pas reconnu comme dépendant du service public",
)
export class CoreFcaAgentNotFromPublicServiceException extends CoreFcaBaseException {
  code = ErrorCode.AGENT_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  illustration = 'access-restricted-error';
  title = 'Accès impossible';
  description =
    "Seuls les agents et agentes de la fonction publique de l'État et de ses opérateurs sont autorisées à se connecter via AgentConnect.";

  public displayContact = true;
  public contactMessage =
    'Si cette situation vous parait inhabituelle, vous pouvez nous signaler l’erreur.';

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'authentication aborted due to invalid identity';
}
