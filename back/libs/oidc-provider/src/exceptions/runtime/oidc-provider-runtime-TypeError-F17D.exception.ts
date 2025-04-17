/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_F17D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F17D';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    'ttl.${key} must be a positive integer or a regular function returning one';
  static DOCUMENTATION =
    'ttl.${key} must be a positive integer or a regular function returning one';
  static ERROR_SOURCE = 'helpers/configuration.js:433';
  static UI = 'OidcProvider.exceptions.TypeError.F17D';
}
