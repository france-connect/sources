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

  constructor() {
    super(
      'Seuls les agents de la fonction publique sont autorisés à se connecter via AgentConnect.',
    );
  }
}
