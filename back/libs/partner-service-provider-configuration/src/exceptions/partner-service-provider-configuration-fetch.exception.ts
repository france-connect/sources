/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { PartnerServiceProviderBaseException } from './partner-service-provider-base.exception';

@Description(
  "Une erreur est survenue lors de l'appel à la base de donnée au fetch des configurations du service provider. Contacter le support N3.",
)
export class PartnerServiceProviderConfigurationFetchException extends PartnerServiceProviderBaseException {
  public readonly code = ErrorCode.FETCH_FAILURE;
  public readonly message =
    'Une erreur technique est survenue, veuillez contacter le support.';
}
