/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { CoreFcaBaseException } from './core-fca-base.exception';

@Description(
  'Aucun fournisseur d’identité n’a été trouvé pour l’usager et il n’y a pas de fournisseur d’identité par défaut configuré pour ce service',
)
export class CoreFcaAgentNoIdpException extends CoreFcaBaseException {
  code = ErrorCode.NO_IDP;
  public readonly httpStatusCode = HttpStatus.BAD_REQUEST;

  illustration = 'temporary-restricted-error';
  title = 'Accès indisponible';
  description =
    'Votre identité ne peut pas être vérifiée pour l’instant. Merci de réessayer dans quelques minutes.';

  public displayContact = true;
  public contactMessage =
    'Si cette situation vous parait inhabituelle, vous pouvez nous signaler l’erreur.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
