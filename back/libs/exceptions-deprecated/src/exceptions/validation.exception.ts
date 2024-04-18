import { ValidationError } from '@nestjs/common';

/**
 * Specific exception for class-validator errors
 */
export class ValidationException extends Error {
  public errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Validation error');
    this.errors = errors;
  }

  /**
   * Expose a factory to use in `ValidationPipe` option object `exceptionFactory`
   *
   * @ee https://github.com/nestjs/nest/issues/1267#issuecomment-445539997
   */
  static factory(errors: ValidationError[]) {
    return new ValidationException(errors);
  }
}
