/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_FBC8_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'FBC8';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    'JWT Access Tokens must contain an audience, for Access Tokens without audience (only usable at the userinfo_endpoint) use an opaque format';
  static DOCUMENTATION =
    'JWT Access Tokens must contain an audience, for Access Tokens without audience (only usable at the userinfo_endpoint) use an opaque format';
  static ERROR_SOURCE = 'models/formats/jwt.js:150';
  static UI = 'OidcProvider.exceptions.Error.FBC8';
}
