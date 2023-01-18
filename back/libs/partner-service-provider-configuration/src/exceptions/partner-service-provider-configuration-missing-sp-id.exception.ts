/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { PartnerServiceProviderBaseException } from './partner-service-provider-base.exception';

@Description(
  "L'identifiant du service provider de la configuration est absent.",
)
export class PartnerServiceProviderConfigurationMissingSpIdException extends PartnerServiceProviderBaseException {
  public readonly code = ErrorCode.MISSING_SP_ID;
  public readonly message =
    'Une erreur technique est survenue, veuillez contacter le support.';
}
