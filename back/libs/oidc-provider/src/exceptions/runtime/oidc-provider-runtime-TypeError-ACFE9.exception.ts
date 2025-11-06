/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_ACFE9_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'ACFE9';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'policies must not be empty';
  static DOCUMENTATION = 'policies must not be empty';
  static ERROR_SOURCE = 'models/mixins/has_policies.js:8';
  static UI = 'OidcProvider.exceptions.TypeError.ACFE9';
}
