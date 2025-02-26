import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enum';
import { EidasClientBaseException } from './eidas-client-base.exception';

export class InvalidResponseIdException extends EidasClientBaseException {
  static CODE = ErrorCode.INVALID_RESPONSE_ID;
  static DOCUMENTATION =
    "La réponse eIDAS ne correspond pas à la requête d'origine : le paramètre `in_response_id` de la réponse ne correspond pas à l'`id` de la requête. Contacter le support N3.";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION =
    'Authentication aborted due to invalid "in_response_id" parameter in the eIDAS response';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'EidasClient.exceptions.invalidResponseId';
}
