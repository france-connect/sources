/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidTarget_CE23_Exception extends OidcProviderBaseRuntimeException {
  static CODE = 'CE23';
  static ERROR_CLASS = 'InvalidTarget';
  static ERROR_DETAIL =
    'only a single resource indicator value must be requested/resolved during Access Token Request';
  static DOCUMENTATION =
    'only a single resource indicator value must be requested/resolved during Access Token Request';
  static ERROR_SOURCE = 'helpers/resolve_resource.js:25';
  static UI = 'OidcProvider.exceptions.InvalidTarget.CE23';
}
