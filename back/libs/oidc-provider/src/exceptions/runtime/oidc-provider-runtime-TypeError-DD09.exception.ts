/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_DD09_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'DD09';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'scope must be a string';
  static DOCUMENTATION = 'scope must be a string';
  static ERROR_SOURCE = 'models/grant.js:155';
  static UI = 'OidcProvider.exceptions.TypeError.DD09';
}
