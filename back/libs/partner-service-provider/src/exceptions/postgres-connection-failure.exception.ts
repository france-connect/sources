/* istanbul ignore file */

// Declarative code
import { Description } from '@fc/exceptions';

import { ErrorCode } from '../enums';
import { PartnerServiceProviderBaseException } from './partner-service-provider-base.exception';

@Description(
  "Une erreur est survenue lors de l'appel à la base de donnée. Contacter le support N3.",
)
export class PostgresConnectionFailure extends PartnerServiceProviderBaseException {
  public readonly code = ErrorCode.POSTGRES_CONNECTION_FAILURE;

  constructor() {
    super('Une erreur technique est survenue, veuillez contacter le support.');
  }
}
