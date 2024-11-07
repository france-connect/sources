export type ValidatorType = (value: string) => string | undefined;

export const composeValidators =
  (...validators: ValidatorType[]) =>
  (value: string) =>
    validators.reduce(
      (error: string | undefined, validator: ValidatorType) => error || validator(value),
      undefined,
    );
