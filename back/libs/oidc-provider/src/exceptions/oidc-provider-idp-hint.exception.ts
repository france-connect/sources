import { ErrorCode } from '../enums';
import { OidcProviderBaseRedirectException } from './oidc-provider-base-redirect.exception';

export class OidcProviderIdpHintException extends OidcProviderBaseRedirectException {
  static CODE = ErrorCode.INVALID_IDP_HINT;
  static DOCUMENTATION = `Une valeur (id de FI) non autorisée a été passée dans idp_hint. Les FI doivent être explicitement autorisés en configuration, contacter support N3`;
  static ERROR = 'invalid_idp_hint';
  static ERROR_DESCRIPTION = 'An idp_hint was provided but is not allowed';
  static UI = 'Core.exceptions.coreIdpHint';
}
