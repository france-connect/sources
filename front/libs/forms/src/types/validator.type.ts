export type ValidatorType<FieldValue = string> = (value: FieldValue) => string | undefined;
