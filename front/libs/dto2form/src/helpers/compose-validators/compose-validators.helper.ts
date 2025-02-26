import type { FieldState, FieldValidator } from 'final-form';

/**
 * @description Compose multiple validators
 * First validator returning an error message will be returned
 */
export const composeValidators =
  (...validators: FieldValidator<string>[]) =>
  (value: string, allValues: object, meta: FieldState<string> | undefined) => {
    const fieldErrorMessage = validators.reduce<string | undefined>(
      (error: string | undefined, validator: FieldValidator<string>): string | undefined => {
        if (error) {
          // @NOTE if previous validator has already sent an error
          // we continue with this error
          return error;
        }
        // @NOTE else we continue with the next validator
        return validator(value, allValues, meta);
      },
      undefined,
    );
    return fieldErrorMessage;
  };
