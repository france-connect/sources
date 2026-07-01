import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { MdocBaseException } from './mdoc-base.exception';

export class MdocDocumentTypeNotFoundException extends MdocBaseException {
  static CODE = ErrorCode.DOCUMENT_TYPE_NOT_FOUND;
  static DOCUMENTATION =
    'The submitted mdoc does not contain a document of asked docType.';
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mdoc document type not found';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
}
