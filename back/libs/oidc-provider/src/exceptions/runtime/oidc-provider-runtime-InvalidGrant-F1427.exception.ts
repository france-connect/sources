/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_F1427_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'F1427';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'mutual TLS client certificate not provided';
  static DOCUMENTATION = 'mutual TLS client certificate not provided';
  static ERROR_SOURCE = 'actions/grants/refresh_token.js:66';
  static UI = 'OidcProvider.exceptions.InvalidGrant.F1427';
}
