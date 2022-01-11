/* istanbul ignore file */

// Declarative code
import { Description, Loggable } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { ApacheIgniteBaseException } from './apache-ignite-base.exception';

@Loggable()
@Description(
  "Le socket entre le bridge et le cache apache ignite n'existe pas. Problème de connexion entre le bridge et le noeud. Impossible de mettre en place le keep alive.",
)
export class ApacheIgniteInvalidSocketException extends ApacheIgniteBaseException {
  constructor() {
    super();
    this.code = ErrorCode.INVALID_SOCKET;
    this.message = `Invalid socket, unable to set keep alive.`;
  }
}
