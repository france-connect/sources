/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_Error_9D53_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9D53';
  static ERROR_CLASS = 'Error';
  static ERROR_DETAIL = 'provider key (kid: ${kid}) is invalid';
  static DOCUMENTATION = 'provider key (kid: ${kid}) is invalid';
  static ERROR_SOURCE = 'models/formats/jwt.js:52';
  static UI = 'OidcProvider.exceptions.Error.9D53';
}
