/* istanbul ignore file */

// Declarative file
import { KekAlg, Use } from '@fc/cryptography';
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description('Aucune clé pertinente trouvée')
export class NoRelevantKeyException extends JwtBaseException {
  code = ErrorCode.NO_RELEVANT_KEY;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor(alg: KekAlg, use: Use) {
    super(`No relevant key found for alg: ${alg} and use: ${use}`);
  }
}
