/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { ApacheIgniteBaseException } from './apache-ignite-base.exception';

@Loggable()
@Description(
  "Le socket entre le bridge et le cache apache ignite n'existe pas. Problème de connexion entre le bridge et le noeud. Impossible de mettre en place le keep alive.",
)
export class ApacheIgniteInvalidSocketException extends ApacheIgniteBaseException {
  code = ErrorCode.INVALID_SOCKET;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
