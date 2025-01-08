import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { Dto2FormBaseException } from './dto2form-base.exception';

export class Dto2FormInvalidMetadataException extends Dto2FormBaseException {
  static CODE = ErrorCode.INVALID_METADATA;
  static HTTP_STATUS_CODE = HttpStatus.INTERNAL_SERVER_ERROR;
  static message =
    'Une erreur technique est survenue. Si le problème persiste, veuillez nous contacter.';
  static DOCUMENTATION = 'Impossible de récupérer les métadonnées lié au dto.';
  static ERROR = 'server_error';
  static ERROR_DESCRIPTION =
    'authentication aborted due to a technical error on the authorization server';
  static UI = 'Dto2form.exceptions.dto2FormInvalidMetadata';
}
