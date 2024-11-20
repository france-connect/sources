/* istanbul ignore file */

// Declarative file
import { KekAlg, Use } from '@fc/cryptography';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class NoRelevantKeyException extends JwtBaseException {
  static CODE = ErrorCode.NO_RELEVANT_KEY;
  static DOCUMENTATION = 'Aucune clé pertinente trouvée';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor(alg: KekAlg, use: Use) {
    super();
    this.log = `No relevant key found for alg: ${alg} and use: ${use}`;
  }
}
