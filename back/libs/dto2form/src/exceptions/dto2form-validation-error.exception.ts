/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { Description } from '@fc/exceptions-deprecated';

import { ErrorCode } from '../enums';
import { FieldErrorsInterface } from '../interfaces';
import { Dto2FormBaseException } from './dto2form-base.exception';

@Description(
  'Les données soumises dans le formulaire ne satisfont pas les règles de validation.',
)
export class Dto2FormValidationErrorException extends Dto2FormBaseException {
  constructor(validationErrors: FieldErrorsInterface[]) {
    /**
     * @todo This need to wait for #1581 to have a way to pass the validation errors to exception filter
     * @author sherman
     */
    super(JSON.stringify(validationErrors, null, 2));
  }

  code = ErrorCode.VALIDATION_ERROR;
  httpStatusCode = HttpStatus.UNPROCESSABLE_ENTITY;
  message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';

  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
}
