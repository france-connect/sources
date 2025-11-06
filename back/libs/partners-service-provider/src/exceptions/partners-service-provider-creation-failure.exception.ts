import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { PartnersServiceProviderBaseException } from './partners-service-provider-base.exception';

export class PartnersServiceProviderCreationFailureException extends PartnersServiceProviderBaseException {
  static DOCUMENTATION =
    'Une erreur est survenue lors de la création du fournisseur de service. Contacter le support N3.';
  static CODE = ErrorCode.SERVICE_PROVIDER_CREATION_FAILURE;
  static UI =
    'PartnersServiceProvider.exceptions.PartnersServiceProviderCreationFailure';

  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
}
