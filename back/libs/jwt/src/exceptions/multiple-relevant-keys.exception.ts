/* istanbul ignore file */

// Declarative file
import { KekAlg, Use } from '@fc/cryptography';
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description(
  "Plusieurs clés pertinentes ont été trouvées alors qu'un kid était fourni",
)
export class MultipleRelevantKeysException extends JwtBaseException {
  code = ErrorCode.MULTIPLE_RELEVANT_KEYS;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor(alg: KekAlg, use: Use, kid: string) {
    super(
      `Multipe relevant keys found alg: ${alg}, kid: ${kid} and use: ${use}`,
    );
  }
}
