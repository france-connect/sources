/* istanbul ignore file */

// Declarative file
import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { OidcAcrBaseException } from './oidc-acr-base.exception';

@Description(
  "Une connexion SSO a échouée car le niveau ACR n'a pas pu être déterminé",
)
export class OidcAcrNoSsoAllowedAcrFoundException extends OidcAcrBaseException {
  code = ErrorCode.NO_SSO_ALLOWED_ACR_FOUND;
  message = 'No SSO allowed ACR found';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
