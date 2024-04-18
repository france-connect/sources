import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

// declarative code
// istanbul ignore next line
@Description(
  "Une erreur s'est produite lors de la révocation d'un token par un FS de démo. Le token a dû expirer avec révocation. Si le problème persiste, contacter le support N3.",
)
export class MockServiceProviderTokenRevocationException extends MockServiceProviderBaseException {
  code = ErrorCode.TOKEN_REVOCATION;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      "Une erreur s'est produite lors de la fermeture de votre session, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support.",
    );
  }
}
