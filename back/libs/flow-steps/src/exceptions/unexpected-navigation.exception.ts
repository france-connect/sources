/* istanbul ignore file */

// Declarative file

import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { FlowStepsBaseException } from './flow-steps-base.exception';

@Description(
  "L'usager fait une navigation anormale, probablement un refresh sur une page déjà en erreur ou un retour arrière non géré",
)
export class UnexpectedNavigationException extends FlowStepsBaseException {
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
  public readonly code = ErrorCode.UNEXPECTED_NAVIGATION;

  public readonly message =
    'Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion.';

  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
}
