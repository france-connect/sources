/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_9E35D_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '9E35D';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL =
    'failed to parse sector_identifier_uri JSON response, err.message';
  static DOCUMENTATION =
    'failed to parse sector_identifier_uri JSON response, err.message';
  static ERROR_SOURCE = 'helpers/sector_validate.js:32';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.9E35D';
}
