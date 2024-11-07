/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

const description =
  "Nous n'arrivons pas à vous identifier. Nous vous conseillons de créer un compte sur le site sans passer par le bouton ProConnect";

@Description(description)
export class CoreFcaAgentNoIdpException extends CoreFcaBaseException {
  code = ErrorCode.NO_IDP;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;
  public description: string = description;

  illustration = 'access-restricted-error';
  title = 'Accès indisponible';
  public displayContact = true;
  public contactMessage =
    'Si cette situation vous parait inhabituelle, vous pouvez nous signaler l’erreur.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
