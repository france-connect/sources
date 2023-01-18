/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { PartnerServiceProviderBaseException } from './partner-service-provider-base.exception';

@Description(
  "Une erreur est survenue lors de l'appel à la base de donnée au post de service provider configuration. Contacter le support N3.",
)
export class PartnerServiceProviderConfigurationPostException extends PartnerServiceProviderBaseException {
  public readonly code = ErrorCode.POST_FAILURE;
  public readonly message =
    'Une erreur technique est survenue, veuillez contacter le support.';
}
