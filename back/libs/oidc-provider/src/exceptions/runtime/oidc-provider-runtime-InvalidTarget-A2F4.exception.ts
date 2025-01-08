/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_A2F4_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'A2F4';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL =
    'only a single resource indicator value is supported for this grant type';
  static DOCUMENTATION =
    'only a single resource indicator value is supported for this grant type';
  static ERROR_SOURCE = 'actions/grants/client_credentials.js:39';
  static UI = 'OidcProvider.exceptions.InvalidTarget.A2F4';
}
