/* istanbul ignore file */

// Declarative code
import { CoreBaseException, ErrorCode } from '@fc/core';
import { Description } from '@fc/exceptions';
/**
 * @todo do not extend class from @fc/core, use a specific BaseException instead
 * This might be done while removing @fc/core altogether in favor of a light code duplication
 * between core-fcp and core-fca.
 */
@Description(
  'La configuration du FS concernant le consentement demandé est incorrect ( un consentement est demandé sur une connexion anonyme, ... ). Contacter le support N3.',
)
export class CoreFcpInvalidEventClassException extends CoreBaseException {
  code = ErrorCode.INVALID_CONSENT_PROCESS;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
