import { ValidationError } from 'class-validator';

import { CommonBaseException } from './common-base.exception';

export class CommonDtoValidationException extends CommonBaseException {
  static CODE = 1;

  constructor(errors: ValidationError[]) {
    super('DtoValidationException');

    this.log = errors;
  }
}
