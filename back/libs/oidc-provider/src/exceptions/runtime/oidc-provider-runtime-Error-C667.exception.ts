/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_C667_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'C667';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL =
    "resolved Resource Server paseto configuration has no corresponding key in the provider's keystore";
  static DOCUMENTATION =
    "resolved Resource Server paseto configuration has no corresponding key in the provider's keystore";
  static ERROR_SOURCE = 'models/formats/paseto.js:79';
  static UI = 'OidcProvider.exceptions.Error.C667';
}
