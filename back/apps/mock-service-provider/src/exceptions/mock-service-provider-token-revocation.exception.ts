import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

// declarative code
// istanbul ignore next line
@Description(
  "Une erreur s'est produite lors de la révocation d'un token par un FS de démo. Le token a dû expirer avec révocation. Si le problème persiste, contacter le support N3.",
)
export class MockServiceProviderTokenRevocationException extends MockServiceProviderBaseException {
  code = ErrorCode.TOKEN_REVOCATION;

  constructor() {
    super(
      "Une erreur s'est produite lors de la fermeture de votre session, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support.",
    );
  }
}
