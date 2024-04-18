/* istanbul ignore file */

// declarative code
import { Description, Loggable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { CsrfBaseException } from './csrf-base.exception';

@Description(
  'le jeton CSRF est invalide. Si le problème persiste, contacter le support N3',
)
@Loggable()
export class CsrfBadTokenException extends CsrfBaseException {
  public readonly code = ErrorCode.BAD_CSRF_TOKEN;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Votre session a expiré ou est invalide, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
