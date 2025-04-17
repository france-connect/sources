/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidGrant_BAB7_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'BAB7';
  static ERROR_CLASS = 'InvalidGrant';
  static ERROR_DETAIL = 'mutual TLS client certificate not provided';
  static DOCUMENTATION = 'mutual TLS client certificate not provided';
  static ERROR_SOURCE = 'actions/grants/ciba.js:57';
  static UI = 'OidcProvider.exceptions.InvalidGrant.BAB7';
}
