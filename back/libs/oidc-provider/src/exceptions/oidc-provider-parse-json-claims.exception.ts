/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcProviderBaseException } from './oidc-provider-base.exception';

@Description(
  "Le format attendu pour le claims n'est pas le bon. Si le problème persiste, contacter le support N3",
)
export class OidcProviderParseJsonClaimsException extends OidcProviderBaseException {
  public readonly code = ErrorCode.PARSE_JSON_CLAIMS;

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';

  constructor() {
    super(
      'Une erreur technique est survenue, fermez l’onglet de votre navigateur et reconnectez-vous.',
    );
  }
}
