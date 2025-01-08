/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_2A25_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '2A25';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'PASETO Access Tokens must contain an audience, for Access Tokens without audience (only usable at the userinfo_endpoint) use an opaque format';
  static DOCUMENTATION =
    'PASETO Access Tokens must contain an audience, for Access Tokens without audience (only usable at the userinfo_endpoint) use an opaque format';
  static ERROR_SOURCE = 'models/formats/paseto.js:152';
  static UI = 'OidcProvider.exceptions.Error.2A25';
}
