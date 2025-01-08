import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { DataProviderAdapterMongoBaseException } from './data-provider-adapter-mongo-base.exception';

export class DataProviderInvalidCredentialsException extends DataProviderAdapterMongoBaseException {
  static CODE = ErrorCode.INVALID_CREDENTIALS;
  static DOCUMENTATION =
    "Le client_id ou le client_secret ne correspond pas à celui d'un fournisseur de données.";
  static ERROR = 'invalid_client';
  static ERROR_DESCRIPTION = 'Client authentication failed.';
  static HTTP_STATUS_CODE = HttpStatus.UNAUTHORIZED;
  static UI =
    'DataProviderAdapterMongo.exceptions.dataProviderInvalidCredentials';
}
