import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { FlowStepsBaseException } from './flow-steps-base.exception';

export class UndefinedStepRouteException extends FlowStepsBaseException {
  static CODE = ErrorCode.UNDEFINED_STEP_ROUTE;
  static DOCUMENTATION =
    "L'usager fait une navigation anormale, probablement un refresh sur une page déjà en erreur ou un retour arrière non géré";
  static ERROR = 'access_denied';
  static ERROR_DESCRIPTION = 'user authentication aborted';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'FlowSteps.exceptions.undefinedStepRoute';
}
