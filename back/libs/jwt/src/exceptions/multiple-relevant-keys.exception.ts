/* istanbul ignore file */

// Declarative file
import { KekAlg, Use } from '@fc/cryptography';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

export class MultipleRelevantKeysException extends JwtBaseException {
  static CODE = ErrorCode.MULTIPLE_RELEVANT_KEYS;
  static DOCUMENTATION =
    "Plusieurs clés pertinentes ont été trouvées alors qu'un kid était fourni";
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Jwt.exceptions.multipleRelevantKeys';

  constructor(alg: KekAlg, use: Use, kid: string) {
    super();
    this.log = `Jwt.exceptions.multipleRelevantKeys alg: ${alg}, kid: ${kid} and use: ${use}`;
  }
}
