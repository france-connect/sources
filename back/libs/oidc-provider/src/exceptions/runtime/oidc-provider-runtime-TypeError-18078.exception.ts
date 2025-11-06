/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_TypeError_18078_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '18078';
  static ERROR_CLASS = 'TypeError';
  static ERROR_DETAIL =
    "${flag} feature is now stable, the ack ${ack} is no longer valid. Check the stable feature's configuration for any breaking changes.";
  static DOCUMENTATION =
    "${flag} feature is now stable, the ack ${ack} is no longer valid. Check the stable feature's configuration for any breaking changes.";
  static ERROR_SOURCE = 'helpers/configuration.js:485';
  static UI = 'OidcProvider.exceptions.TypeError.18078';
}
