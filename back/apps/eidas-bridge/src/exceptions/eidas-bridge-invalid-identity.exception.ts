/* istanbul ignore file */

// Declarative code
import { ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';

import { EidasBridgeBaseException } from './eidas-bridge-base.exception';

@Description(
  "L'identité reçue du bridge eIDAS ( venant d'un autre état membre ) n'est pas valide. Contacter le support N3",
)
export class EidasBridgeInvalidIdentityException extends EidasBridgeBaseException {
  code = ErrorCode.INVALID_IDENTITY;

  constructor() {
    super(
      'Une erreur technique est survenue lors de la récupération de votre identité. Contactez le support',
    );
  }
}
