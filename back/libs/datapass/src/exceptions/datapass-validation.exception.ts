import { ValidationError } from '@nestjs/common';

import { getAllPropertiesErrors } from '@fc/common';

import { ErrorCode } from '../enums';
import { DatapassBaseException } from './datapass-base.exception';

export class DatapassValidationException extends DatapassBaseException {
  static CODE = ErrorCode.DATAPASS_VALIDATION_FAILED;
  static DOCUMENTATION = 'Échec de la validation du payload webhook Datapass';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION = 'Failed to validate Datapass webhook payload';
  static UI = 'Datapass.exceptions.validationFailed';

  constructor(validationErrors: ValidationError[]) {
    super();
    this.log = getAllPropertiesErrors(validationErrors);
  }
}
