/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_16633_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '16633';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL = 'policy ${policy} not configured';
  static DOCUMENTATION = 'policy ${policy} not configured';
  static ERROR_SOURCE = 'models/mixins/has_policies.js:15';
  static UI = 'OidcProvider.exceptions.TypeError.16633';
}
