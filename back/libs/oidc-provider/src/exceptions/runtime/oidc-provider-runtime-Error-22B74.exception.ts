/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_22B74_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '22B74';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    "resolved Resource Server jwt configuration has no corresponding key in the provider's keystore";
  static DOCUMENTATION =
    "resolved Resource Server jwt configuration has no corresponding key in the provider's keystore";
  static ERROR_SOURCE = 'models/formats/jwt.js:48';
  static UI = 'OidcProvider.exceptions.Error.22B74';
}
