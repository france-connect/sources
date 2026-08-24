import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { PartnersBaseException } from './partners-base.exception';

export class PartnersInstanceNotFoundException extends PartnersBaseException {
  static CODE = ErrorCode.INSTANCE_NOT_FOUND;
  static DOCUMENTATION = 'L’instance n’a pas été trouvée.';
  static HTTP_STATUS_CODE = HttpStatus.NOT_FOUND;
  static UI = 'Partners.exceptions.PartnersInstanceNotFoundException';
}
