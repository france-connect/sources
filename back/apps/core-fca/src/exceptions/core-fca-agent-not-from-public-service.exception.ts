/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { CoreBaseException, ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';

@Description(
  "L'utilisateur renseigné n'est pas reconnu comme dépendant du service public",
)
export class CoreFcaAgentNotFromPublicServiceException extends CoreBaseException {
  code = ErrorCode.AGENT_NOT_FOUND;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'authentication aborted due to invalid identity';

  constructor() {
    super(
      'Seuls les agents et agentes de la fonction publique sont autorisées à se connecter via AgentConnect.',
    );
  }
}
