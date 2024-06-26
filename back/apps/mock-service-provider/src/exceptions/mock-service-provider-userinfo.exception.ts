import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { MockServiceProviderBaseException } from './mock-service-provider-base.exception';

// declarative code
// istanbul ignore next line

@Description(
  "Une erreur s'est produite lors de la récupération des données utilisateurs depuis un FS de démo. Il faut recommencer la cinématique. Si le problème persiste, contacter le support N3",
)
export class MockServiceProviderUserinfoException extends MockServiceProviderBaseException {
  code = ErrorCode.USERINFO;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous. Si le problème persiste, contacter le support.',
    );
  }
}
