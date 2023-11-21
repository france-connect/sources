/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { FlowStepsBaseException } from './flow-steps-base.exception';

@Description(
  "L'usager fait une navigation anormale, probablement un refresh sur une page déjà en erreur ou un retour arrière non géré",
)
export class UndefinedStepRouteException extends FlowStepsBaseException {
  public readonly statusCode = 400;
  public readonly code = ErrorCode.UNDEFINED_STEP_ROUTE;

  public readonly message =
    'Nous vous invitons à fermer tous les onglets de votre navigateur et à vous authentifier de nouveau en suivant les étapes de connexion.';
}
