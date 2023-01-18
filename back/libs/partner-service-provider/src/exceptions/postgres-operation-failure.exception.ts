/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { PartnerServiceProviderBaseException } from './partner-service-provider-base.exception';

@Description(
  "Une erreur est survenue lors de la modification de l'increment du service provider.",
)
export class PostgresOperationFailure extends PartnerServiceProviderBaseException {
  public readonly code = ErrorCode.POSTGRES_OPERATION_FAILURE;
  public readonly message =
    'Une erreur technique est survenue, veuillez contacter le support.';
}
