/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CryptographyBaseException } from './cryptography-base.exception';

@Description(
  "Il y a un problème dans le format du payload à signer (on attend du Uint8Array, on reçoit autre chose). L'application est inutilisable pour tous les usagers. Contacter le support N3 en urgence.",
)
export class CryptographyInvalidPayloadFormatException extends CryptographyBaseException {
  public readonly code = ErrorCode.INVALID_PAYLOAD_FORMAT;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
