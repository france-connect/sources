/**
 * Code generated from oidc-provider exceptions
 * @see @fc/oidc-provider/src/cli/scaffold-exceptions/run.sh
 */
import { OidcProviderBaseRuntimeException } from '../oidc-provider-base-runtime.exception';

export class OidcProviderRuntime_InvalidClientMetadata_198B_Exception extends OidcProviderBaseRuntimeException {
  static CODE = '198B';
  static ERROR_CLASS = 'InvalidClientMetadata';
  static ERROR_DETAIL = 'no suitable encryption key found (${encryption.alg})';
  static DOCUMENTATION = 'no suitable encryption key found (${encryption.alg})';
  static ERROR_SOURCE = 'models/id_token.js:203';
  static UI = 'OidcProvider.exceptions.InvalidClientMetadata.198B';
}
