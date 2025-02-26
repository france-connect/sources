import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { FieldErrorsInterface } from '../interfaces';
import { Dto2FormBaseException } from './dto2form-base.exception';

export class Dto2FormValidationErrorException extends Dto2FormBaseException {
  static DOCUMENTATION =
    'Les données soumises dans le formulaire ne satisfont pas les règles de validation.';
  static CODE = ErrorCode.VALIDATION_ERROR;
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static HTTP_STATUS_CODE = HttpStatus.UNPROCESSABLE_ENTITY;
  static UI = 'Dto2form.exceptions.dto2formValidationError';

  constructor(validationErrors: FieldErrorsInterface[]) {
    super();
    this.log = validationErrors;
  }
}
