import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { DataProviderAdapterMongoBaseException } from './data-provider-adapter-mongo-base.exception';

export class DataProviderNotFoundException extends DataProviderAdapterMongoBaseException {
  static CODE = ErrorCode.DATA_PROVIDER_NOT_FOUND;
  static DOCUMENTATION =
    'Aucun fournisseur de données trouvé avec ce client_id.';
  static ERROR = 'invalid_client';
  static ERROR_DESCRIPTION = 'Client authentication failed.';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
  static UI = 'DataProviderAdapterMongo.exceptions.dataProviderNotFound';
}
