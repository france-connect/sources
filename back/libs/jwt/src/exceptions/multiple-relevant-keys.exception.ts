/* istanbul ignore file */

// Declarative file
import { KekAlg, Use } from '@fc/cryptography';
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enum';
import { JwtBaseException } from './jwt-base.exception';

@Description(
  "Plusieurs clés pertinentes ont été trouvées alors qu'un kid était fourni",
)
export class MultipleRelevantKeysException extends JwtBaseException {
  code = ErrorCode.MULTIPLE_RELEVANT_KEYS;

  constructor(alg: KekAlg, use: Use, kid: string) {
    super(
      `Multipe relevant keys found alg: ${alg}, kid: ${kid} and use: ${use}`,
    );
  }
}
