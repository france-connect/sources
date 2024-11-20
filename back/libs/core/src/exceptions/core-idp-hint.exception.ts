/* istanbul ignore file */

// Declarative code
import { OidcProviderBaseRedirectException } from '@fc/oidc-provider/exceptions';

import { ErrorCode } from '../enums';

export class CoreIdpHintException extends OidcProviderBaseRedirectException {
  static CODE = ErrorCode.INVALID_IDP_HINT;
  static DOCUMENTATION = `Une valeur (id de FI) non autorisée a été passée dans idp_hint. Les FI doivent être explicitement autorisés en configuration, contacter support N3`;
  static ERROR = 'invalid_idp_hint';
  static ERROR_DESCRIPTION = 'An idp_hint was provided but is not allowed';
  static SCOPE = 3;
  static UI = 'Core.exceptions.coreIdpHint';
}
