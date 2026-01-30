import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { PartnersServiceProviderBaseException } from './partners-service-provider-base.exception';

export class PartnersServiceProviderNotFoundException extends PartnersServiceProviderBaseException {
  static CODE = ErrorCode.SERVICE_PROVIDER_NOT_FOUND;
  static DOCUMENTATION = "Le fournisseur de service n'a pas été trouvé.";
  static UI =
    'PartnersServiceProvider.exceptions.PartnersServiceProviderNotFoundException';

  static HTTP_STATUS_CODE = HttpStatus.NOT_FOUND;
}
