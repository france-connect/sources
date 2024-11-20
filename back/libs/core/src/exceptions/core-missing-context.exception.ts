/* istanbul ignore file */

// Declarative code
import { HttpStatus } from '@nestjs/common';

import { ErrorCode } from '../enums';
import { CoreBaseException } from './core-base.exception';

export class CoreMissingContextException extends CoreBaseException {
  static CODE = ErrorCode.MISSING_CONTEXT;
  static DOCUMENTATION =
    "La requête HTTP n'est pas valide, FranceConnect+ n'a pas pu la traiter car il manque des élements obligatoires ( headers, ... ). Cette erreur ne devrait pas se produire, contacter le service technique";
  static ERROR = 'invalid_request';
  static ERROR_DESCRIPTION = 'mandatory parameter missing';
  static HTTP_STATUS_CODE = HttpStatus.BAD_REQUEST;
  static UI = 'Core.exceptions.coreMissingContext';

  constructor(param: string) {
    super();
    this.log = `${CoreMissingContextException.ERROR_DESCRIPTION}: ${param}`;
  }
}
