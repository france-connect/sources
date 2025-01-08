import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

export class CoreFcaAgentNoIdpException extends CoreFcaBaseException {
  static DOCUMENTATION =
    "Nous n'arrivons pas à vous identifier. Nous vous conseillons de créer un compte sur le site sans passer par le bouton ProConnect";
  static CODE = ErrorCode.NO_IDP;
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  public description = CoreFcaAgentNoIdpException.DOCUMENTATION;
  public illustration = 'access-restricted-error';
  public title = 'Accès indisponible';
  public displayContact = true;
  public contactMessage =
    'Si cette situation vous parait inhabituelle, vous pouvez nous signaler l’erreur.';
}
